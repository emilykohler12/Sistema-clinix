import { useEffect } from 'react'
import { Avatar } from '../atoms/Avatar'
import { PatientInfoGrid } from './PatientInfoGrid'
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden animate-fadeIn card"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="h-2 card-accent-bar" />

        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <Avatar avatar={patient.avatar} name={patient.name} id={patient.id} size="lg" />
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold mb-1 text-primary">{patient.name}</h2>
                <span className="text-sm px-3 py-1 rounded-full badge-id">DNI {patient.documentId}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
              <button onClick={() => toggleFavorite(patient.id)} className="text-2xl transition-transform hover:scale-125">
                <span className={isFavorite(patient.id) ? 'star-active' : 'star-inactive'}>★</span>
              </button>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:opacity-70 transition-opacity text-muted">
                ✕
              </button>
            </div>
          </div>

          <PatientInfoGrid patient={patient} formatDate={formatDate} />

          <div className="card-divider-top" style={{ paddingTop: '1.25rem', marginTop: '1.25rem' }}>
            <button
              onClick={() => { openEdit(patient); onClose() }}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 btn-save-gradient"
            >
              Editar paciente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
