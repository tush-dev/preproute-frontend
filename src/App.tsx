import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AddQuestions } from './pages/AddQuestions'
import { CreateTest } from './pages/CreateTest'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { PreviewPublish } from './pages/PreviewPublish'
import { TestTracking } from './pages/TestTracking'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-test" element={<CreateTest />} />
          <Route path="/create-test/:id" element={<CreateTest />} />
          <Route path="/add-questions" element={<AddQuestions />} />
          <Route path="/preview" element={<PreviewPublish />} />
          <Route path="/test-tracking" element={<TestTracking />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
