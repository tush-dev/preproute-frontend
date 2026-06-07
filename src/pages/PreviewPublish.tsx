import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { publishTest } from '../api/endpoints'
import { TestSummaryCard } from '../components/TestSummaryCard'
import { useAppStore } from '../store/useAppStore'
import type { TestFormValues } from '../types'
import { defaultTestValues } from '../utils/helpers'

export function PreviewPublish() {
  const navigate = useNavigate()
  const currentTest = useAppStore((state) => state.currentTest)
  const setCurrentTest = useAppStore((state) => state.setCurrentTest)
  const questions = useAppStore((state) => state.questions)
  const subjects = useAppStore((state) => state.subjects)
  const topics = useAppStore((state) => state.topics)
  const subTopics = useAppStore((state) => state.subTopics)
  const [mode, setMode] = useState<'now' | 'schedule'>('now')
  const [liveUntil, setLiveUntil] = useState('custom')
  const [publishDate, setPublishDate] = useState('')
  const [publishTime, setPublishTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(false)

  const form = useMemo<TestFormValues>(() => {
    if (!currentTest) return defaultTestValues
    return {
      name: currentTest.name,
      type: currentTest.type,
      subject: currentTest.subject,
      topics: currentTest.topics || [],
      sub_topics: currentTest.sub_topics || [],
      difficulty:
        currentTest.difficulty === 'medium' || currentTest.difficulty === 'hard'
          ? currentTest.difficulty
          : 'easy',
      total_time: currentTest.total_time,
      total_marks: currentTest.total_marks,
      total_questions: currentTest.total_questions,
      correct_marks: currentTest.correct_marks,
      wrong_marks: currentTest.wrong_marks,
      unattempt_marks: currentTest.unattempt_marks,
      status: currentTest.status,
    }
  }, [currentTest])

  if (!currentTest) {
    navigate('/create-test')
    return null
  }

  const selectedSubject = subjects.find(
    (subject) => subject.id === form.subject || subject.name === form.subject,
  )
  const selectedTopics = topics.filter(
    (topic) => form.topics.includes(topic.id) || form.topics.includes(topic.name),
  )
  const selectedSubTopics = subTopics.filter(
    (subTopic) =>
      form.sub_topics.includes(subTopic.id) || form.sub_topics.includes(subTopic.name),
  )

  const dateTimeValue = (date: string, time: string) => {
    if (!date || !time) return undefined
    return new Date(`${date}T${time}`).toISOString()
  }

  const computedLiveUntil = () => {
    const start = mode === 'schedule' ? dateTimeValue(publishDate, publishTime) : undefined
    const base = start ? new Date(start) : new Date()
    if (liveUntil === 'custom') return dateTimeValue(endDate, endTime)
    if (liveUntil === 'always') return undefined
    const daysByOption: Record<string, number> = {
      '1-week': 7,
      '2-weeks': 14,
      '3-weeks': 21,
      '1-month': 30,
    }
    const days = daysByOption[liveUntil]
    if (!days) return undefined
    base.setDate(base.getDate() + days)
    return base.toISOString()
  }

  const confirmPublish = async () => {
    if (mode === 'schedule' && (!publishDate || !publishTime)) {
      toast.error('Select publish date and time')
      return
    }
    if (mode === 'schedule' && liveUntil === 'custom' && (!endDate || !endTime)) {
      toast.error('Select end date and time')
      return
    }
    const publishAt = mode === 'schedule' ? dateTimeValue(publishDate, publishTime) : undefined
    const endsAt = mode === 'schedule' ? computedLiveUntil() : undefined
    if (publishAt && new Date(publishAt) <= new Date()) {
      toast.error('Schedule time must be in the future')
      return
    }
    if (endsAt && new Date(endsAt) <= (publishAt ? new Date(publishAt) : new Date())) {
      toast.error('End time must be after the publish time')
      return
    }
    setLoading(true)
    try {
      const response = await publishTest(currentTest, {
        status: mode === 'schedule' ? 'scheduled' : 'live',
        publish_at: mode === 'schedule' ? publishAt : undefined,
        live_until: mode === 'schedule' ? endsAt : undefined,
      })
      setCurrentTest(response.data)
      toast.success(mode === 'schedule' ? 'Test scheduled successfully' : 'Test published successfully')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not publish test')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="publish-page">
      <div className="publish-screen">
        <div className="breadcrumb">Test creation</div>
        <div className="created-row">
          <strong>Test created</strong>
          <span className="done-pill">All {form.total_questions || 50} Questions done</span>
        </div>
        <TestSummaryCard
          form={form}
          subject={selectedSubject}
          topics={selectedTopics}
          subTopics={selectedSubTopics}
          onEdit={() => navigate(`/create-test/${currentTest.id}`)}
        />
        <div className="tabs publish-tabs">
          <button className={mode === 'now' ? 'active' : ''} onClick={() => setMode('now')} type="button">
            Publish Now
          </button>
          <button
            className={mode === 'schedule' ? 'active' : ''}
            onClick={() => setMode('schedule')}
            type="button"
          >
            Schedule Publish
          </button>
        </div>
        {mode === 'schedule' ? (
          <>
            <h2>Select Date and Time</h2>
            <div className="publish-grid">
              <label className="date-input-shell">
                <input
                  aria-label="Select Date"
                  type="date"
                  value={publishDate}
                  onChange={(event) => setPublishDate(event.target.value)}
                />
                <span>▣</span>
              </label>
              <label className="date-input-shell">
                <input
                  aria-label="Select Time"
                  type="time"
                  value={publishTime}
                  onChange={(event) => setPublishTime(event.target.value)}
                />
                <span>⌄</span>
              </label>
            </div>
          </>
        ) : null}
        <h2>Live Until</h2>
        <p>Choose how long this test should remain available on the platform.</p>
        <div className="radio-grid">
          {[
            ['always', 'Always Available'],
            ['1-week', '1 Week'],
            ['2-weeks', '2 Weeks'],
            ['3-weeks', '3 Weeks'],
            ['1-month', '1 Month'],
            ['custom', 'Custom Duration'],
          ].map(([value, label]) => (
            <label key={value}>
              <input
                checked={liveUntil === value}
                type="radio"
                onChange={() => setLiveUntil(value)}
              />
              {label}
            </label>
          ))}
        </div>
        {liveUntil === 'custom' ? (
          <div className="publish-grid">
            <label className="date-input-shell">
              <input
                aria-label="Select End Date"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
              <span>▣</span>
            </label>
            <label className="date-input-shell">
              <input
                aria-label="Select End Time"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
              <span>⌄</span>
            </label>
          </div>
        ) : null}
        <div className="preview-list">
          <button className="ghost-button small" type="button" onClick={() => navigate('/add-questions')}>
            Edit questions
          </button>
          {!questions.length ? (
            <div className="empty-state">
              No saved questions are attached to this test yet. Use `Edit questions` to add MCQs.
            </div>
          ) : null}
          {questions.map((question, index) => (
            <article key={question.client_id || question.id || index}>
              <strong>
                {index + 1}. {question.question || 'Untitled question'}
              </strong>
              {question.media_url ? (
                <img className="preview-question-image" src={question.media_url} alt="Question media" />
              ) : null}
              {(['option1', 'option2', 'option3', 'option4'] as const).map((key) => (
                <span className={question.correct_option === key ? 'correct-option' : ''} key={key}>
                  {question[key] || key}
                </span>
              ))}
            </article>
          ))}
        </div>
        <div className="form-actions">
          <button className="ghost-button" onClick={() => navigate('/dashboard')} type="button">
            Cancel
          </button>
          <button className="primary-button" disabled={loading} onClick={confirmPublish} type="button">
            {loading ? 'Publishing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </section>
  )
}
