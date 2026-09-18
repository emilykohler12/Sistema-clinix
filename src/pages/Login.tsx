import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useClinicStore } from '../store/useClinicStore'

export function Login() {
  const navigate = useNavigate()
  const login = useClinicStore(state => state.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="card w-full max-w-sm rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.jpg" alt="Clinix" className="w-14 h-14 object-contain rounded-xl mb-3" />
          <h1 className="text-xl font-bold text-primary">Clinix</h1>
          <p className="text-sm text-secondary">Sistema de gestión clínica</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-sm mb-1 block text-secondary">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="modal-input w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="admin@clinix.com"
            />
          </div>
          <div>
            <label className="text-sm mb-1 block text-secondary">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="modal-input w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-save-gradient mt-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-xs text-muted mt-4 text-center">
          <Link to="/recuperar-contrasena" className="link-accent font-medium">¿Olvidaste tu contraseña?</Link>
        </p>

        <p className="text-xs text-muted mt-3 text-center">
          ¿Sos profesional y no tenés cuenta? <Link to="/register" className="link-accent font-medium">Registrate</Link>
        </p>
      </div>
    </div>
  )
}
