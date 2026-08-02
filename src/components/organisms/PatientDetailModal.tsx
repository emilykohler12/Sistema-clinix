import { useEffect } from 'react'
import { Avatar } from '../atoms/Avatar'
import { formatDate } from '../../utils/formatDate'
import { useClinicStore } from '../../store/useClinicStore'
import type { Patient } from '../../types'

interface PatientDetailModalProps {
  patient: Patient
  onClose: () => void
}

export function PatientDetailModal({ patient, onClose }: PatientDetailModalProps) {
  const { isFavorite, toggleFavorite, openEdit } = useClinicStore()

  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const websiteUrl = patient.website
    ? patient.website.startsWith('http') ? patient.website : `https://${patient.website}`
    : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden animate-fadeIn"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--bg-card-border)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="h-2" style={{ background: 'linear-gradient(90deg, #4c6f87, #6aa6aa)' }} />

        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <Avatar avatar={patient.avatar} name={patient.name} id={patient.id} size="lg" />
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-xl font-bold mb-1 text-primary">{patient.name}</h2>
                <span className="text-sm px-3 py-1 rounded-full badge-id">
                  ID #{patient.id}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
              <button
                onClick={() => toggleFavorite(patient.id)}
                className="text-2xl transition-transform hover:scale-125"
              >
                <span className={isFavorite(patient.id) ? 'star-active' : 'star-inactive'}>★</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:opacity-70 transition-opacity text-muted"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-medium mb-2 uppercase tracking-wide text-muted">Descripción</p>
              <p className="text-sm leading-relaxed text-secondary">{patient.description}</p>
            </div>

            <div style={{ borderTop: '1px solid var(--bg-card-divider)', paddingTop: '1.25rem' }}>
              <p className="text-xs font-medium mb-3 uppercase tracking-wide text-muted">Información</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-page)', border: '1px solid var(--bg-card-border)' }}>
                  <p className="text-xs mb-1 text-muted">📅 Fecha de registro</p>
                  <p className="text-sm font-medium text-primary">{formatDate(patient.createdAt)}</p>
                </div>
                {websiteUrl && (
                  <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-page)', border: '1px solid var(--bg-card-border)' }}>
                    <p className="text-xs mb-1 text-muted">🔗 Sitio web</p>
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline truncate block link-accent"
                    >
                      {patient.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--bg-card-divider)', paddingTop: '1.25rem' }}>
              <button
                onClick={() => { openEdit(patient); onClose() }}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 btn-save-gradient"
              >
                ✏️ Editar paciente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}