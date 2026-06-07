import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAppStore } from '../store/useAppStore'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAppStore((state) => state.token)
  return token || localStorage.getItem('token') ? children : <Navigate to="/" replace />
}
