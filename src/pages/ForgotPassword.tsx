import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { requestPasswordReset, resetPassword } from '../services/authService'

type Step = 'request' | 'reset'

export function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const inputClass = "modal-input w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
  const labelClass = "text-sm mb-1 block text-secondary"

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await requestPasswordReset(email)
      setInfo('Si el email está registrado, te enviamos un código de 6 dígitos. Revisá tu bandeja de entrada.')
      setStep('reset')
    } catch {
      setError('No se pudo enviar el código. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      await resetPassword(email, code, newPassword)
      navigate('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido o vencido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="card w-full max-w-sm rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.jpg" alt="Clinix" className="w-14 h-14 object-contain rounded-xl mb-3" />
          <h1 className="text-xl font-bold text-primary">Recuperar contraseña</h1>
          <p className="text-sm text-secondary text-center mt-1">
            {step === 'request' ? 'Te enviamos un código a tu email' : 'Ingresá el código y tu nueva contraseña'}
          </p>
        </div>

        {info && <p className="text-xs text-secondary mb-3 text-center">{info}</p>}

        {step === 'request' ? (
          <form onSubmit={handleRequestCode} className="flex flex-col gap-3">
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className={inputClass}
                placeholder="ana.lopez@clinix.com"
              />
            </div>

            {error && <p className="text-xs text-error">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-save-gradient mt-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Enviando...' : 'Enviar código'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-3">
            <div>
              <label className={labelClass}>Código de 6 dígitos</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                required
                className={`${inputClass} text-center tracking-[0.5em] font-semibold`}
                placeholder="123456"
              />
            </div>
            <div>
              <label className={labelClass}>Nueva contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className={inputClass}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label className={labelClass}>Confirmar contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className={inputClass}
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-xs text-error">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-save-gradient mt-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
            <button
              type="button"
              onClick={() => setStep('request')}
              className="text-xs text-secondary text-center mt-1"
            >
              ¿No te llegó el código? Volver a enviar
            </button>
          </form>
        )}

        <p className="text-xs text-muted mt-5 text-center">
          <Link to="/login" className="link-accent font-medium">Volver a ingresar</Link>
        </p>
      </div>
    </div>
  )
}
