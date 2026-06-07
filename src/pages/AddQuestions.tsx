import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { bulkCreateQuestions, updateTest } from '../api/endpoints'
import { TestSummaryCard } from '../components/TestSummaryCard'
import { useAppStore } from '../store/useAppStore'
import type { Question, TestFormValues } from '../types'
import { defaultTestValues, makeQuestion } from '../utils/helpers'

export function AddQuestions() {
  const navigate = useNavigate()
  const currentTest = useAppStore((state) => state.currentTest)
  const setCurrentTest = useAppStore((state) => state.setCurrentTest)
  const questions = useAppStore((state) => state.questions)
  const setQuestions = useAppStore((state) => state.setQuestions)
  const addQuestion = useAppStore((state) => state.addQuestion)
  const updateQuestion = useAppStore((state) => state.updateQuestion)
  const removeQuestion = useAppStore((state) => state.removeQuestion)
  const subjects = useAppStore((state) => state.subjects)
  const topics = useAppStore((state) => state.topics)
  const subTopics = useAppStore((state) => state.subTopics)
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const questionTextRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (!currentTest) {
      navigate('/create-test')
      return
    }
    if (!questions.length) {
      setQuestions([makeQuestion(currentTest.id)])
    }
  }, [currentTest, navigate, questions.length, setQuestions])

  const activeQuestion = questions[activeIndex] || questions[0]
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

  const changeQuestion = (changes: Partial<Question>) => {
    if (!activeQuestion?.client_id) return
    updateQuestion(activeQuestion.client_id, changes)
  }

  const addBlank = () => {
    addQuestion(makeQuestion(currentTest?.id || ''))
    setActiveIndex(questions.length)
  }

  const deleteActive = () => {
    if (!activeQuestion?.client_id) return
    removeQuestion(activeQuestion.client_id)
    setActiveIndex(0)
  }

  const applyFormatting = (format: 'bold' | 'italic' | 'underline' | 'bullet') => {
    if (!activeQuestion?.client_id) return
    const textarea = questionTextRef.current
    const value = activeQuestion.question || ''
    const start = textarea?.selectionStart ?? value.length
    const end = textarea?.selectionEnd ?? value.length
    const selected = value.slice(start, end) || 'text'
    const wrappers = {
      bold: ['**', '**'],
      italic: ['_', '_'],
      underline: ['<u>', '</u>'],
      bullet: ['\n- ', ''],
    } satisfies Record<string, [string, string]>
    const [before, after] = wrappers[format]
    const nextValue = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`
    changeQuestion({ question: nextValue })
    requestAnimationFrame(() => {
      questionTextRef.current?.focus()
      questionTextRef.current?.setSelectionRange(
        start + before.length,
        start + before.length + selected.length,
      )
    })
  }

  const parseCsvLine = (line: string) => {
    const cells: string[] = []
    let current = ''
    let quoted = false
    for (const char of line) {
      if (char === '"') {
        quoted = !quoted
      } else if (char === ',' && !quoted) {
        cells.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    cells.push(current.trim())
    return cells.map((cell) => cell.replace(/^"|"$/g, ''))
  }

  const uploadCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !currentTest) return
    const text = await file.text()
    const rows = text
      .split(/\r?\n/)
      .map((row) => row.trim())
      .filter(Boolean)
    if (rows.length < 2) {
      toast.error('CSV must include a header row and at least one question')
      return
    }
    const headers = parseCsvLine(rows[0]).map((header) => header.toLowerCase())
    const imported = rows.slice(1).map((row) => {
      const cells = parseCsvLine(row)
      const value = (name: string) => cells[headers.indexOf(name)] || ''
      return {
        ...makeQuestion(currentTest.id),
        question: value('question'),
        option1: value('option1'),
        option2: value('option2'),
        option3: value('option3'),
        option4: value('option4'),
        correct_option: value('correct_option') || 'option1',
        explanation: value('explanation'),
        difficulty: value('difficulty') || 'easy',
        media_url: value('media_url'),
        topic: value('topic'),
        sub_topic: value('sub_topic'),
      }
    })
    setQuestions([...questions, ...imported])
    setActiveIndex(questions.length)
    toast.success(`Imported ${imported.length} question(s) from CSV`)
    event.target.value = ''
  }

  const saveAndContinue = async () => {
    if (!currentTest) return
    const ready = questions.filter(
      (question) =>
        question.question &&
        question.option1 &&
        question.option2 &&
        question.option3 &&
        question.option4,
    )
    if (!ready.length) {
      toast.error('Add at least one complete MCQ')
      return
    }
    setLoading(true)
    try {
      const response = await bulkCreateQuestions(
        ready.map((question) => {
          const topicName = topics.find((topic) => topic.id === question.topic)?.name || question.topic
          const subTopicName =
            subTopics.find((subTopic) => subTopic.id === question.sub_topic)?.name ||
            question.sub_topic

          return {
            type: 'mcq',
            question: question.question,
            option1: question.option1,
            option2: question.option2,
            option3: question.option3,
            option4: question.option4,
            correct_option: question.correct_option,
            explanation: question.explanation || undefined,
            difficulty: question.difficulty || 'easy',
            test_id: currentTest.id,
            subject: currentTest.subject,
            topic: topicName || undefined,
            sub_topic: subTopicName || undefined,
            media_url: question.media_url || undefined,
          }
        }),
      )
      const questionIds = response.data.map((question) => question.id).filter(Boolean)
      const updatedTest = await updateTest(currentTest.id, {
        questions: questionIds,
        total_questions: ready.length,
        total_marks: currentTest.total_marks,
      })
      setCurrentTest(updatedTest.data)
      toast.success('Questions saved')
      navigate('/preview')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save questions')
    } finally {
      setLoading(false)
    }
  }

  if (!currentTest || !activeQuestion) return null

  return (
    <section className="question-workspace">
      <div className="question-main">
        <div className="question-topline">
          <div className="breadcrumb">Test Creation / Create Test / Chapter Wise</div>
          <button className="primary-button" type="button" onClick={saveAndContinue}>
            Publish
          </button>
        </div>
        <TestSummaryCard
          form={form}
          subject={selectedSubject}
          topics={selectedTopics}
          subTopics={selectedSubTopics}
          onEdit={() => navigate(`/create-test/${currentTest.id}`)}
        />
        <div className="question-heading">
          <h2>
            Question {activeIndex + 1}
            <span>/{form.total_questions || 50}</span>
          </h2>
          <div className="question-actions">
            <button className="ghost-button small" onClick={addBlank} type="button">
              + Add
            </button>
            <label className="csv-upload ghost-button small">
              CSV
              <input accept=".csv,text/csv" type="file" onChange={uploadCsv} />
            </label>
          </div>
        </div>
        <button className="danger-link" onClick={deleteActive} type="button">
          Delete All Edits
        </button>
        <div className="editor-box">
          <div className="editor-tools">
            <button type="button" onClick={() => applyFormatting('bold')}>
              B
            </button>
            <button type="button" onClick={() => applyFormatting('italic')}>
              I
            </button>
            <button type="button" onClick={() => applyFormatting('underline')}>
              U
            </button>
            <button type="button" onClick={() => applyFormatting('bullet')}>
              list
            </button>
          </div>
          <textarea
            ref={questionTextRef}
            placeholder="Type here"
            value={activeQuestion.question}
            onChange={(event) => changeQuestion({ question: event.target.value })}
          />
        </div>
        <label className="wide-label">
          Add Image URL
          <input
            placeholder="https://example.com/image.png"
            value={activeQuestion.media_url || ''}
            onChange={(event) => changeQuestion({ media_url: event.target.value })}
          />
        </label>
        {activeQuestion.media_url ? (
          <div className="image-preview">
            <img src={activeQuestion.media_url} alt="Question media preview" />
          </div>
        ) : null}
        <h3>Type the options below</h3>
        {(['option1', 'option2', 'option3', 'option4'] as const).map((key, index) => (
          <div className="option-row" key={key}>
            <input
              checked={activeQuestion.correct_option === key}
              name="correct"
              type="radio"
              onChange={() => changeQuestion({ correct_option: key })}
            />
            <input
              placeholder="Type Option here"
              value={activeQuestion[key] || ''}
              onChange={(event) => changeQuestion({ [key]: event.target.value })}
            />
            <span>{index + 1}</span>
          </div>
        ))}
        <details className="solution-details" open>
          <summary>Add Solution</summary>
          <textarea
            placeholder="Type here"
            value={activeQuestion.explanation || ''}
            onChange={(event) => changeQuestion({ explanation: event.target.value })}
          />
        </details>
        <h3>Question settings</h3>
        <label className="wide-label">
          Level of Difficulty
          <select
            value={activeQuestion.difficulty || 'easy'}
            onChange={(event) => changeQuestion({ difficulty: event.target.value })}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Difficult</option>
          </select>
        </label>
        <label className="wide-label">
          Topic
          <select
            value={activeQuestion.topic || ''}
            onChange={(event) => changeQuestion({ topic: event.target.value })}
          >
            <option value="">Select from Drop-down</option>
            {topics.map((topic) => (
              <option value={topic.id} key={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </label>
        <label className="wide-label">
          Sub-topic
          <select
            value={activeQuestion.sub_topic || ''}
            onChange={(event) => changeQuestion({ sub_topic: event.target.value })}
          >
            <option value="">Select from Drop-down</option>
            {subTopics.map((subTopic) => (
              <option value={subTopic.id} key={subTopic.id}>
                {subTopic.name}
              </option>
            ))}
          </select>
        </label>
        <div className="form-actions">
          <button className="ghost-button" onClick={() => navigate('/dashboard')} type="button">
            Save Test Changes
          </button>
          <button className="primary-button" disabled={loading} onClick={saveAndContinue} type="button">
            {loading ? 'Saving...' : 'Next'}
          </button>
        </div>
      </div>
    </section>
  )
}
