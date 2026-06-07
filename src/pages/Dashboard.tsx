import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchBulkQuestions, getAllTests, updateTest } from '../api/endpoints'
import { useAppStore } from '../store/useAppStore'
import type { Test } from '../types'
import { formatDate } from '../utils/helpers'

const sampleTests: Test[] = [
  {
    id: 'sample-1',
    name: 'Chapter 1 Grammar Test',
    type: 'chapterwise',
    subject: 'English',
    topics: ['Grammar', 'Writing'],
    sub_topics: ['Application'],
    correct_marks: 5,
    wrong_marks: -1,
    unattempt_marks: 0,
    difficulty: 'easy',
    total_time: 60,
    total_marks: 250,
    total_questions: 50,
    status: 'draft',
    created_at: new Date().toISOString(),
  },
]

export function Dashboard() {
  const [tests, setTests] = useState<Test[]>([])
  const [search, setSearch] = useState('')
  const clearTest = useAppStore((state) => state.clearTest)
  const setCurrentTest = useAppStore((state) => state.setCurrentTest)
  const setQuestions = useAppStore((state) => state.setQuestions)
  const navigate = useNavigate()

  useEffect(() => {
    void getAllTests()
      .then((response) => setTests(response.data || []))
      .catch(() => {
        setTests([])
        toast.error('Could not load tests. Showing empty dashboard.')
      })
  }, [])

  const createNew = () => {
    clearTest()
    navigate('/create-test')
  }

  const editTest = (test: Test) => {
    setCurrentTest(test)
    navigate(`/create-test/${test.id}`)
  }

  const viewTest = async (test: Test) => {
    setCurrentTest(test)
    setQuestions([])
    if (test.questions?.length) {
      try {
        const response = await fetchBulkQuestions(test.questions)
        setQuestions(response.data || [])
      } catch {
        toast.error('Could not load questions for this test')
      }
    }
    navigate('/preview')
  }

  const softDelete = async (test: Test) => {
    if (!confirm(`Delete ${test.name}?`)) return
    try {
      await updateTest(test.id, { status: 'deleted' })
      setTests((items) => items.filter((item) => item.id !== test.id))
      toast.success('Test removed')
    } catch {
      setTests((items) => items.filter((item) => item.id !== test.id))
      toast.success('Removed from dashboard view')
    }
  }

  const visibleTests = (tests.length ? tests : sampleTests).filter((test) =>
    [test.name, test.subject, test.status, test.topics?.join(' ')]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  return (
    <section className="dashboard-screen">
      <div className="screen-heading">
        <div>
          <span>Dashboard</span>
          <h1>Tests</h1>
        </div>
        <button className="primary-button" onClick={createNew} type="button">
          + Create New Test
        </button>
      </div>
      <div className="toolbar">
        <input
          placeholder="Search tests"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div className="test-table">
        <div className="table-row table-head dashboard-columns">
          <span>Test Name</span>
          <span>Subject</span>
          <span>Topics</span>
          <span>Status</span>
          <span>Created At</span>
          <span>Actions</span>
        </div>
        {visibleTests.length === 0 ? (
          <div className="empty-state">No tests found. Create your first test to begin.</div>
        ) : null}
        {visibleTests.map((test) => (
          <div className="table-row dashboard-columns" key={test.id}>
            <button className="test-name-button" onClick={() => void viewTest(test)} type="button">
              {test.name}
            </button>
            <span>{test.subject || 'English'}</span>
            <span>{Array.isArray(test.topics) ? test.topics.join(', ') : '-'}</span>
            <span className={`status-pill ${test.status || 'draft'}`}>{test.status || 'draft'}</span>
            <span>{formatDate(test.created_at)}</span>
            <div className="row-actions">
              <button type="button" onClick={() => editTest(test)}>
                Edit
              </button>
              <button type="button" onClick={() => void viewTest(test)}>
                View
              </button>
              <button type="button" onClick={() => softDelete(test)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
