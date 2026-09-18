import { useEffect, useState } from 'react'
import { Sidebar } from '../components/organisms/Sidebar'
import { Avatar } from '../components/atoms/Avatar'
import { ImageUpload } from '../components/molecules/ImageUpload'
import { ConfirmToast } from '../components/molecules/ConfirmToast'
import { useClinicStore } from '../store/useClinicStore'
import type { Doctor } from '../types'

export function Doctors() {
  const { doctors, doctorsLoading, loadDoctors, addDoctor, archiveDoctor, toggleDoctorActive, authUser, addToast } = useClinicStore()
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('clinix_theme') === 'dark')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [avatar, setAvatar] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null)

  const isAdmin = authUser?.role === 'admin'

  useEffect(() => {
    loadDoctors()
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('clinix_theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  function resetForm() {
    setName(''); setEmail(''); setPassword(''); setSpecialty(''); setAvatar(''); setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await addDoctor({ name, email, password, specialty })
      addToast('Profesional agregado correctamente', 'success')
      setShowForm(false)
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el profesional')
    } finally {
      setSaving(false)
    }
  }

  async function handleConfirmDelete() {
    if (!doctorToDelete) return
    const id = doctorToDelete.id
    setDoctorToDelete(null)
    try {
      await archiveDoctor(id)
      addToast('Profesional movido a archivados', 'success')
    } catch {
      addToast('No se pudo eliminar el profesional', 'error')
    }
  }

  async function handleToggleActive(doctor: Doctor) {
    try {
      await toggleDoctorActive(doctor.id, !doctor.active)
      addToast(doctor.active ? 'Profesional desactivado' : 'Profesional activado', 'success')
    } catch {
      addToast('No se pudo cambiar el estado del profesional', 'error')
    }
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <Sidebar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(prev => !prev)} />

      <div className="flex-1 min-w-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-2xl font-bold text-primary">Profesionales</h2>
                <p className="text-sm text-secondary">Personal habilitado para usar el sistema</p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowForm(prev => !prev)}
                className="btn-save-gradient px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              >
                {showForm ? 'Cancelar' : '+ Nuevo profesional'}
              </button>
            )}
          </div>

          {showForm && isAdmin && (
            <form onSubmit={handleSubmit} className="card rounded-2xl p-6 mb-6 flex flex-col gap-3 max-w-lg">
              <ImageUpload value={avatar} onChange={setAvatar} name={name || 'Profesional'} id="new-doctor" />
              <div>
                <label className="text-sm mb-1 block text-secondary">Nombre completo *</label>
                <input value={name} onChange={e => setName(e.target.value)} required className="modal-input w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="Dra. Ana López" />
              </div>
              <div>
                <label className="text-sm mb-1 block text-secondary">Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="modal-input w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="ana.lopez@clinix.com" />
              </div>
              <div>
                <label className="text-sm mb-1 block text-secondary">Especialidad</label>
                <input value={specialty} onChange={e => setSpecialty(e.target.value)} className="modal-input w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="Clínica médica" />
              </div>
              <div>
                <label className="text-sm mb-1 block text-secondary">Contraseña provisoria *</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="modal-input w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="Mínimo 6 caracteres" />
              </div>
              {error && <p className="text-xs text-error">{error}</p>}
              <button type="submit" disabled={saving} className="btn-save-gradient px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-90 disabled:opacity-60">
                {saving ? 'Guardando...' : 'Crear profesional'}
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {doctors.map(d => (
              <div key={d.id} className={`card rounded-2xl p-4 flex items-center gap-3 ${!d.active ? 'opacity-60' : ''}`}>
                <Avatar avatar={d.avatar ?? ''} name={d.name} id={d.id} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate text-primary">{d.name}</p>
                  <p className="text-xs truncate text-muted">{d.email}</p>
                  <div className="flex items-center gap-1.5 flex-wrap mt-1">
                    {d.specialty && <span className="text-xs px-2 py-0.5 rounded-full badge-id">{d.specialty}</span>}
                    <span className="text-xs px-2 py-0.5 rounded-full badge-status-discharged">
                      {d.role === 'admin' ? 'Administrador' : 'Profesional'}
                    </span>
                    {!d.active && (
                      <span className="text-xs px-2 py-0.5 rounded-full badge-status-admitted">Desactivado</span>
                    )}
                  </div>
                </div>
                {isAdmin && d.id !== authUser?.id && (
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleToggleActive(d)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all icon-btn-edit"
                    >
                      {d.active ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => setDoctorToDelete(d)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all icon-btn-delete"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}
            {doctorsLoading && <p className="text-secondary">Cargando profesionales...</p>}
          </div>
        </div>
      </div>

      {doctorToDelete && (
        <ConfirmToast
          message={`¿Eliminar la cuenta de ${doctorToDelete.name}? Se puede restaurar desde Archivados.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDoctorToDelete(null)}
        />
      )}
    </div>
  )
}
