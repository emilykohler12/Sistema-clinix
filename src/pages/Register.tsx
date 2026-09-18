import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useClinicStore } from '../store/useClinicStore'

export function Register() {
  const navigate = useNavigate()
  const register = useClinicStore(state => state.register)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      await register(name, email, password, specialty)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="card w-full max-w-sm rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.jpg" alt="Clinix" className="w-14 h-14 object-contain rounded-xl mb-3" />
          <h1 className="text-xl font-bold text-primary">Crear cuenta</h1>
          <p className="text-sm text-secondary">Registro de profesionales</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-sm mb-1 block text-secondary">Nombre completo</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="modal-input w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Dra. Ana López"
            />
          </div>
          <div>
            <label className="text-sm mb-1 block text-secondary">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="modal-input w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="ana.lopez@clinix.com"
            />
          </div>
          <div>
            <label className="text-sm mb-1 block text-secondary">Especialidad (opcional)</label>
            <input
              type="text"
              value={specialty}
              onChange={e => setSpecialty(e.target.value)}
              className="modal-input w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Clínica médica"
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
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label className="text-sm mb-1 block text-secondary">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
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
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-xs text-muted mt-5 text-center">
          ¿Ya tenés cuenta? <Link to="/login" className="link-accent font-medium">Ingresar</Link>
        </p>
      </div>
    </div>
  )
}
