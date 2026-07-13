import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Avatar } from '../components/atoms/Avatar'
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
        <span className="text-5xl">🔍</span>
        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Paciente no encontrado</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-sm text-white rounded-lg"
          style={{ backgroundColor: '#4c6f87' }}
        >
          Volver al inicio
        </button>
      </div>
    )
  }

  const websiteUrl = patient.website
    ? patient.website.startsWith('http') ? patient.website : `https://${patient.website}`
    : null

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="sticky top-0 z-40" style={{ background: 'linear-gradient(135deg, #4c6f87 0%, #6aa6aa 100%)' }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-1"
          >
            ← Volver
          </button>
          <span className="text-white/30">|</span>
          <span className="text-white text-sm font-medium">Detalle del paciente</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--bg-card-border)' }}>
          <div className="h-2" style={{ background: 'linear-gradient(90deg, #4c6f87, #6aa6aa)' }} />
          <div className="p-6">
            <div className="flex items-start gap-5 mb-6">
              <Avatar avatar={patient.avatar} name={patient.name} id={patient.id} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {patient.name}
                    </h1>
                    <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--id-bg)', color: 'var(--accent)' }}>
                      ID #{patient.id}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleFavorite(patient.id)}
                    className="text-3xl transition-transform hover:scale-125 flex-shrink-0"
                  >
                    <span style={{ color: isFavorite(patient.id) ? '#f59e0b' : 'var(--star-empty)' }}>★</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Descripción</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{patient.description}</p>
              </div>

              <div style={{ borderTop: '1px solid var(--bg-card-divider)', paddingTop: '1.25rem' }}>
                <p className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Información</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-page)', border: '1px solid var(--bg-card-border)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>📅 Fecha de registro</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatDate(patient.createdAt)}</p>
                  </div>
                  {websiteUrl && (
                    <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-page)', border: '1px solid var(--bg-card-border)' }}>
                      <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>🔗 Sitio web</p>
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:underline truncate block"
                        style={{ color: 'var(--accent-2)' }}
                      >
                        {patient.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--bg-card-divider)', paddingTop: '1.25rem' }}>
                <button
                  onClick={() => openEdit(patient)}
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #4c6f87, #6aa6aa)' }}
                >
                  ✏️ Editar paciente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}