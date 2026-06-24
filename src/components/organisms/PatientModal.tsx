import { useState, useEffect } from 'react'
import type { Patient } from '../../types'

interface PatientModalProps {
  mode: 'add' | 'edit'
  patient?: Patient
  onSave: (patient: Patient) => void
  onClose: () => void
}

interface FormErrors {
  name?: string
  description?: string
  website?: string
  createdAt?: string
}

export function PatientModal({ mode, patient, onSave, onClose }: PatientModalProps) {
  const [name, setName] = useState(patient?.name ?? '')
  const [description, setDescription] = useState(patient?.description ?? '')
  const [website, setWebsite] = useState(patient?.website ?? '')
  const [avatar, setAvatar] = useState(typeof patient?.avatar === 'string' ? patient.avatar : '')
  const [createdAt, setCreatedAt] = useState(() => {
    if (patient?.createdAt) return patient.createdAt.split('T')[0]
    return new Date().toISOString().split('T')[0]
  })
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!name.trim() || name.trim().length < 1) newErrors.name = 'El nombre es requerido (mínimo 1 caracter)'
    if (!description.trim() || description.trim().length < 1) newErrors.description = 'La descripción es requerida (mínimo 1 caracter)'
    if (website && !website.match(/^https?:\/\/.+/)) newErrors.website = 'La URL debe comenzar con http:// o https://'
    if (!createdAt) newErrors.createdAt = 'La fecha es requerida'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSave() {
    if (!validate()) return
    const saved: Patient = {
      id: patient?.id ?? Math.floor(Math.random() * 10000).toString(),
      name: name.trim(),
      description: description.trim(),
      website: website.trim(),
      avatar: avatar.trim(),
      createdAt: new Date(createdAt).toISOString(),
    }
    onSave(saved)
  }

  const inputClass = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 modal-input"

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="rounded-2xl w-full max-w-md flex flex-col card"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header fijo */}
        <div className="flex items-center justify-between p-6 pb-0 flex-shrink-0">
          <h2 className="text-lg font-medium text-primary">
            {mode === 'add' ? 'Agregar paciente' : 'Editar paciente'}
          </h2>
          <button onClick={onClose} className="text-xl hover:opacity-70 text-muted">×</button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex flex-col gap-3 p-6 overflow-y-auto">
          <div>
            <label className="text-sm mb-1 block text-secondary">Nombre *</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })) }}
              className={inputClass}
              placeholder="Nombre completo"
            />
            {errors.name && <p className="text-xs mt-1 text-error">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm mb-1 block text-secondary">Descripción *</label>
            <textarea
              value={description}
              onChange={e => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: undefined })) }}
              className={inputClass}
              rows={3}
              style={{ resize: 'vertical', maxHeight: '200px' }}
              placeholder="Descripción del paciente"
            />
            {errors.description && <p className="text-xs mt-1 text-error">{errors.description}</p>}
          </div>

          <div>
            <label className="text-sm mb-1 block text-secondary">Fecha de registro *</label>
            <input
              type="date"
              value={createdAt}
              onChange={e => { setCreatedAt(e.target.value); setErrors(prev => ({ ...prev, createdAt: undefined })) }}
              className={inputClass}
            />
            {errors.createdAt && <p className="text-xs mt-1 text-error">{errors.createdAt}</p>}
          </div>

          <div>
            <label className="text-sm mb-1 block text-secondary">Website</label>
            <input
              type="text"
              value={website}
              onChange={e => { setWebsite(e.target.value); setErrors(prev => ({ ...prev, website: undefined })) }}
              className={inputClass}
              placeholder="https://ejemplo.com"
            />
            {errors.website && <p className="text-xs mt-1 text-error">{errors.website}</p>}
          </div>

          <div>
            <label className="text-sm mb-1 block text-secondary">Avatar URL</label>
            <input
              type="text"
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              className={inputClass}
              placeholder="https://ejemplo.com/foto.jpg"
            />
          </div>
        </div>

        {/* Footer fijo */}
        <div className="flex justify-end gap-3 p-6 pt-2 flex-shrink-0 card-divider-top">
          <button onClick={onClose} className="px-4 py-2 text-sm transition-colors text-secondary">Cancelar</button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm text-white rounded-lg transition-colors hover:opacity-90 btn-save-gradient"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}