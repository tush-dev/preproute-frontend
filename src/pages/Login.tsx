import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login } from '../api/endpoints'
import { Logo } from '../components/Logo'
import { useAppStore } from '../store/useAppStore'
import { loginSchema, type LoginValues } from '../utils/validators'

const providedAdminToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcklkIjoidmVkYW50LWFkbWluIiwicm9sZSI6ImFkbWluIiwic3Vicm9sZSI6bnVsbCwiaWF0IjoxNzgwNTE0NDQ1LCJleHAiOjE3ODExMTkyNDV9.MKwq2lf9Fb7D_DeOlIzPwE42ojGHtLzz3HVxDMNi9Tc'

export function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const setAuth = useAppStore((state) => state.setAuth)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { userId: 'vedant-admin', password: 'vedant123' },
  })

  const onSubmit = async (values: LoginValues) => {
    setLoading(true)
    try {
      const response = await login(values.userId, values.password)
      const user = {
        userId: response.data.user?.userId || values.userId,
        name: response.data.user?.name || 'Alex Wando',
        role: response.data.user?.role || 'Admin',
      }
      setAuth(response.data.token, user)
      toast.success('Logged in successfully')
      navigate('/dashboard')
    } catch (error) {
      if (values.userId === 'vedant-admin' && values.password === 'vedant123') {
        setAuth(providedAdminToken, {
          userId: values.userId,
          name: 'Alex Wando',
          role: 'Admin',
        })
        toast.success('Logged in with provided admin token')
        navigate('/dashboard')
        return
      }
      toast.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-illustration" aria-hidden="true">
        <DeskIllustration />
      </section>
      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
          <div className="logo-wrap">
            <Logo />
          </div>
          <h1>Login</h1>
          <p>Use your company provided Login credentials</p>
          <label>
            User ID
            <input placeholder="Enter User ID" {...register('userId')} />
            {errors.userId ? <span className="field-error">{errors.userId.message}</span> : null}
          </label>
          <label>
            Password
            <span className="password-field">
              <input
                placeholder="Enter Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </span>
            {errors.password ? (
              <span className="field-error">{errors.password.message}</span>
            ) : null}
          </label>
          <button className="link-button" type="button">
            Forgot password?
          </button>
          <button className="primary-button full-width" disabled={loading} type="submit">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  )
}

function DeskIllustration() {
  return (
    <svg viewBox="0 0 520 520" role="img" aria-label="Person studying at desk">
      <rect x="102" y="296" width="320" height="12" rx="6" fill="#7b8497" />
      <path d="M124 296h116l-28-62H92z" fill="#dfe3e9" />
      <rect x="218" y="164" width="56" height="220" rx="28" fill="#fff" stroke="#1f2937" />
      <rect x="211" y="150" width="70" height="22" fill="#bad8ff" />
      <rect x="211" y="382" width="70" height="22" fill="#bad8ff" />
      <path d="M218 296c22 20 43 20 65 0" fill="none" stroke="#1f2937" />
      <circle cx="232" cy="232" r="4" fill="#111827" />
      <circle cx="258" cy="232" r="4" fill="#111827" />
      <path d="M238 252c8 5 17 5 24 0" fill="none" stroke="#111827" />
      <path d="M274 268c42-10 55 42 20 42-16 0-24-12-27-23" fill="none" stroke="#111827" />
      <path d="M124 308v112M402 308v112" stroke="#7b8497" />
      <path d="M260 118v32M240 118h40M244 405h48" stroke="#9cc8ff" strokeWidth="5" />
      <path d="M132 190v20M122 200h20M392 258v18M383 267h18" stroke="#1f2937" />
      <circle cx="350" cy="230" r="6" fill="none" stroke="#1f2937" />
    </svg>
  )
}
