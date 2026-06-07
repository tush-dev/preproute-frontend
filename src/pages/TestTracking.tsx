import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getAllTests } from '../api/endpoints'
import type { Test } from '../types'
import { formatDate } from '../utils/helpers'

export function TestTracking() {
  const [tests, setTests] = useState<Test[]>([])

  useEffect(() => {
    void getAllTests()
      .then((response) => setTests(response.data || []))
      .catch(() => toast.error('Could not load tracking data'))
  }, [])

  const liveTests = tests.filter((test) =>
    ['live', 'published', 'scheduled'].includes(test.status || ''),
  )

  return (
    <section className="tracking-screen">
      <div className="screen-heading">
        <div>
          <span>Test Tracking</span>
          <h1>Published tests</h1>
        </div>
      </div>
      <div className="tracking-grid">
        {(liveTests.length ? liveTests : tests.slice(0, 6)).map((test) => (
          <article className="tracking-card" key={test.id}>
            <div>
              <span className={`status-pill ${test.status || 'draft'}`}>
                {test.status || 'draft'}
              </span>
              <h2>{test.name}</h2>
            </div>
            <dl>
              <dt>Subject</dt>
              <dd>{test.subject}</dd>
              <dt>Questions</dt>
              <dd>{test.total_questions}</dd>
              <dt>Marks</dt>
              <dd>{test.total_marks}</dd>
              <dt>Created</dt>
              <dd>{formatDate(test.created_at)}</dd>
            </dl>
          </article>
        ))}
      </div>
      {!tests.length ? <div className="empty-state">No tests available for tracking yet.</div> : null}
    </section>
  )
}
