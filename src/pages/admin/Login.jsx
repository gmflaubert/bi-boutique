import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { STORE_CONFIG } from '../../config'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) return null
  if (isAuthenticated) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const success = await login(email, password)
    if (success) {
      navigate('/admin')
    } else {
      setError('Invalid email or password')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <img src="/logo.jpg" alt={STORE_CONFIG.storeName} className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />
          <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>Admin Login</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>{STORE_CONFIG.storeName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none"
              required
            />
          </div>
          {error && <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
