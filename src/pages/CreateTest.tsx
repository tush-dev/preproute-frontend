import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  createTest,
  getSubjects,
  getSubTopicsByTopics,
  getTestById,
  getTopicsBySubject,
  updateTest,
} from '../api/endpoints'
import { useAppStore } from '../store/useAppStore'
import type { Subject, SubTopic, TestFormValues, Topic } from '../types'
import {
  defaultTestValues,
  fallbackSubjects,
  fallbackSubTopics,
  fallbackTopics,
} from '../utils/helpers'
import { testSchema } from '../utils/validators'

export function CreateTest() {
  const { id } = useParams()
  const navigate = useNavigate()
  const currentTest = useAppStore((state) => state.currentTest)
  const setCurrentTest = useAppStore((state) => state.setCurrentTest)
  const setStoreSubjects = useAppStore((state) => state.setSubjects)
  const setStoreTopics = useAppStore((state) => state.setTopics)
  const setStoreSubTopics = useAppStore((state) => state.setSubTopics)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [subTopics, setSubTopics] = useState<SubTopic[]>([])
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TestFormValues>({
    resolver: zodResolver(testSchema) as Resolver<TestFormValues>,
    defaultValues: defaultTestValues,
  })

  const subject = useWatch({ control, name: 'subject' })
  const selectedTopics = useWatch({ control, name: 'topics' })
  const selectedSubTopics = useWatch({ control, name: 'sub_topics' })
  const correctMarks = useWatch({ control, name: 'correct_marks' })
  const totalQuestions = useWatch({ control, name: 'total_questions' })
  const testType = useWatch({ control, name: 'type' })

  useEffect(() => {
    void getSubjects()
      .then((response) => {
        const next = response.data?.length ? response.data : fallbackSubjects
        setSubjects(next)
        setStoreSubjects(next)
      })
      .catch(() => {
        setSubjects(fallbackSubjects)
        setStoreSubjects(fallbackSubjects)
      })
  }, [setStoreSubjects])

  useEffect(() => {
    if (!id) return
    if (currentTest?.id === id) {
      reset({
        ...defaultTestValues,
        ...currentTest,
        topics: currentTest.topics || [],
        sub_topics: currentTest.sub_topics || [],
        difficulty:
          currentTest.difficulty === 'medium' || currentTest.difficulty === 'hard'
            ? currentTest.difficulty
            : 'easy',
        status: currentTest.status || 'draft',
      })
      return
    }
    void getTestById(id)
      .then((response) => {
        const test = response.data
        setCurrentTest(test)
        reset({
          ...defaultTestValues,
          ...test,
          topics: test.topics || [],
          sub_topics: test.sub_topics || [],
          difficulty: test.difficulty === 'medium' || test.difficulty === 'hard' ? test.difficulty : 'easy',
          status: test.status || 'draft',
        })
      })
      .catch(() => {
        toast.error('Could not pre-fill this test')
        navigate('/dashboard')
      })
  }, [currentTest, id, navigate, reset, setCurrentTest])

  useEffect(() => {
    if (!subject) {
      void Promise.resolve().then(() => setTopics([]))
      return
    }
    void getTopicsBySubject(subject)
      .then((response) => {
        const next = response.data?.length ? response.data : []
        setTopics(next)
        setStoreTopics(next)
      })
      .catch(() => {
        const hasFallbackSubject = fallbackSubjects.some((item) => item.id === subject)
        const next = hasFallbackSubject
          ? fallbackTopics.filter((topic) => topic.subject_id === subject)
          : []
        setTopics(next)
        setStoreTopics(next)
      })
  }, [subject, setStoreTopics])

  useEffect(() => {
    if (!selectedTopics?.length) {
      void Promise.resolve().then(() => setSubTopics([]))
      return
    }
    void getSubTopicsByTopics(selectedTopics)
      .then((response) => {
        const next = response.data?.length ? response.data : []
        setSubTopics(next)
        setStoreSubTopics(next)
      })
      .catch(() => {
        const next = fallbackSubTopics.filter((subTopic) =>
          selectedTopics.includes(subTopic.topic_id),
        )
        setSubTopics(next)
        setStoreSubTopics(next)
      })
  }, [selectedTopics, setStoreSubTopics])

  useEffect(() => {
    setValue('total_marks', Number(correctMarks || 0) * Number(totalQuestions || 0))
  }, [correctMarks, setValue, totalQuestions])

  const selectTopic = (topicId: string) => {
    const next = topicId ? [topicId] : []
    setValue('topics', next, { shouldValidate: true })
    setValue('sub_topics', [], { shouldValidate: true })
  }

  const selectSubTopic = (subTopicId: string) => {
    setValue('sub_topics', subTopicId ? [subTopicId] : [], { shouldValidate: true })
  }

  const onSubmit = async (values: TestFormValues) => {
    setLoading(true)
    try {
      const payload: TestFormValues = {
        ...values,
        status: values.status || 'draft',
      }
      const response = id ? await updateTest(id, payload) : await createTest(payload)
      setCurrentTest(response.data)
      toast.success(id ? 'Test updated' : 'Test created')
      navigate('/add-questions')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save test')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={`details-screen ${id ? 'edit-details-screen' : ''}`}>
      {id ? (
        <div className="edit-modal-title">
          <span>Edit Test creation</span>
          <button type="button" onClick={() => navigate('/dashboard')}>
            ×
          </button>
        </div>
      ) : null}
      <div className="question-topline">
        <div className="breadcrumb">Test Creation / Create Test / Chapter Wise</div>
        <button className="primary-button" type="button" onClick={handleSubmit(onSubmit)}>
          Publish
        </button>
      </div>
      <div className="tabs">
        {[
          ['chapterwise', 'Chapter Wise'],
          ['pyq', 'PYQ'],
          ['mock', 'Mock Test'],
        ].map(([value, label]) => (
          <button
            className={testType === value ? 'active' : ''}
            key={value}
            onClick={() => setValue('type', value, { shouldDirty: true, shouldValidate: true })}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-grid">
          <label>
            Subject
            <select {...register('subject')}>
              <option value="">Choose from Drop-down</option>
              {subjects.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.subject ? <span className="field-error">{errors.subject.message}</span> : null}
          </label>
          <label>
            Name of Test
            <input placeholder="Enter name of Test" {...register('name')} />
            {errors.name ? <span className="field-error">{errors.name.message}</span> : null}
          </label>
          <label>
            Topic
            <select
              value={selectedTopics?.[0] || ''}
              onChange={(event) => selectTopic(event.target.value)}
            >
              <option value="">Choose from Drop-down</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
            {errors.topics ? <span className="field-error">{errors.topics.message}</span> : null}
          </label>
          <label>
            Sub Topic
            <select
              value={selectedSubTopics?.[0] || ''}
              onChange={(event) => selectSubTopic(event.target.value)}
            >
              <option value="">Choose from Drop-down</option>
              {subTopics.map((subTopic) => (
                <option key={subTopic.id} value={subTopic.id}>
                  {subTopic.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Duration (Minutes)
            <input placeholder="Enter the time" type="number" {...register('total_time')} />
            {errors.total_time ? (
              <span className="field-error">{errors.total_time.message}</span>
            ) : null}
          </label>
        </div>
        <div className="field-block difficulty-block">
          <span>Test Difficulty Level</span>
          <div className="radio-row">
            {[
              ['easy', 'Easy'],
              ['medium', 'Medium'],
              ['hard', 'Difficult'],
            ].map(([difficulty, label]) => (
              <label key={difficulty}>
                <input type="radio" value={difficulty} {...register('difficulty')} />
                {label}
              </label>
            ))}
          </div>
        </div>
        <h2>Marking Scheme:</h2>
        <div className="marks-grid">
          <label>
            Wrong Answer
            <input type="number" {...register('wrong_marks')} />
          </label>
          <label>
            Unattempted
            <input type="number" {...register('unattempt_marks')} />
          </label>
          <label>
            Correct Answer
            <input type="number" {...register('correct_marks')} />
          </label>
          <label>
            No of Questions
            <input type="number" {...register('total_questions')} />
          </label>
          <label>
            Total Marks
            <input readOnly type="number" {...register('total_marks')} />
          </label>
        </div>
        <div className="form-actions">
          <button className="ghost-button" onClick={() => navigate('/dashboard')} type="button">
            Cancel
          </button>
          <button className="primary-button" disabled={loading} type="submit">
            {loading ? 'Saving...' : id ? 'Save' : 'Next'}
          </button>
        </div>
      </form>
    </section>
  )
}
