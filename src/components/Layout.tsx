import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { Logo } from './Logo'
import { Navbar } from './Navbar'

export function Layout() {
  const clearTest = useAppStore((state) => state.clearTest)
  const questions = useAppStore((state) => state.questions)
  const currentTest = useAppStore((state) => state.currentTest)
  const navigate = useNavigate()
  const location = useLocation()
  const isPreview = location.pathname === '/preview'
  const isQuestionCreation = location.pathname === '/add-questions'
  const isQuestionFlow = isPreview || isQuestionCreation
  const isTestCreation =
    location.pathname.startsWith('/create-test') || isQuestionCreation || isPreview

  const startCreate = () => {
    clearTest()
    navigate('/create-test')
  }

  return (
    <main className={`app-shell ${isQuestionFlow ? 'confirmation-shell' : ''} ${isQuestionCreation ? 'question-flow-shell' : ''}`}>
      <aside className="sidebar">
        <Logo />
        {isQuestionFlow ? (
          <div className="confirmation-left">
            <div className="icon-rail" aria-hidden="true">
              {['↗', '✎', '!', '▣', '♙', '⌂', '◎', '▱', '₹', '♜', '…', '♢', '⚙'].map((icon) => (
                <span key={icon}>{icon}</span>
              ))}
            </div>
            <div className="confirmation-question-list">
              <div className="question-list-title">
                <span>Question creation</span>
                <button onClick={() => navigate('/create-test')} type="button">
                  ≪
                </button>
              </div>
              <div className="flow-route-links">
                <button onClick={() => navigate('/dashboard')} type="button">
                  Dashboard
                </button>
                <button onClick={() => navigate('/create-test')} type="button">
                  Test Creation
                </button>
                <button onClick={() => navigate('/test-tracking')} type="button">
                  Test Tracking
                </button>
              </div>
              <strong>Total Questions . {currentTest?.total_questions || 50}</strong>
              {(questions.length ? questions : Array.from({ length: 6 })).map((_, index) => (
                <button key={questions.length ? questions[index]?.client_id : index} type="button">
                  <span>✓</span>
                  Question {index === 0 || index > 2 ? 'x' : index + 1}
                  <em>»</em>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <nav className="main-nav">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <button className={isTestCreation ? 'active' : ''} onClick={startCreate} type="button">
              Test Creation
            </button>
            <NavLink to="/test-tracking">Test Tracking</NavLink>
          </nav>
        )}
      </aside>
      <section className="workspace">
        <Navbar />
        <div className="workspace-body">
          <Outlet />
        </div>
      </section>
    </main>
  )
}
