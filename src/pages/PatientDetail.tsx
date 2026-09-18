import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Avatar } from '../components/atoms/Avatar'
import { PatientInfoGrid } from '../components/organisms/PatientInfoGrid'
import { formatDate } from '../utils/formatDate'
import { useClinicStore } from '../store/useClinicStore'

export function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { patients, patientDetail, fetchPatientById, loading, error, isFavorite, toggleFavorite, openEdit } = useClinicStore()

  const patientFromMemory = patients.find(p => p.id === id)
  const patient = patientFromMemory ?? patientDetail

  useEffect(() => {
    if (!patientFromMemory && id) {
      fetchPatientById(id)
    }
  }, [id])

  if (loading && !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Cargando paciente...</p>
        </div>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'var(--bg-page)' }}>
        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Paciente no encontrado</p>
        <button onClick={() => navigate('/')} className="px-4 py-2 text-sm text-white rounded-lg btn-save-gradient">
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="sticky top-0 z-40 navbar-gradient no-print">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-1">
              ← Volver
            </button>
            <span className="text-white/30">|</span>
            <span className="text-white text-sm font-medium">Detalle del paciente</span>
          </div>
          <button onClick={() => window.print()} className="text-white/80 hover:text-white transition-colors text-sm">
            Imprimir / Exportar PDF
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn print-area">
        <div className="rounded-2xl overflow-hidden card">
          <div className="h-2 card-accent-bar" />
          <div className="p-6">
            <div className="flex items-start gap-5 mb-6">
              <Avatar avatar={patient.avatar} name={patient.name} id={patient.id} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold mb-1 text-primary">{patient.name}</h1>
                    <span className="text-sm px-3 py-1 rounded-full badge-id">DNI {patient.documentId}</span>
                  </div>
                  <button onClick={() => toggleFavorite(patient.id)} className="text-3xl transition-transform hover:scale-125 flex-shrink-0 no-print">
                    <span className={isFavorite(patient.id) ? 'star-active' : 'star-inactive'}>★</span>
                  </button>
                </div>
              </div>
            </div>

            <PatientInfoGrid patient={patient} formatDate={formatDate} />

            <div className="card-divider-top no-print" style={{ paddingTop: '1.25rem', marginTop: '1.25rem' }}>
              <button onClick={() => openEdit(patient)} className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 btn-save-gradient">
                Editar paciente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
