import { useParams, useNavigate } from 'react-router-dom'
import { Avatar } from '../components/atoms/Avatar'
import { formatDate } from '../utils/formatDate'
import { useClinicStore } from '../store/useClinicStore'

export function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { patients, isFavorite, toggleFavorite, openEdit } = useClinicStore()
  const patient = patients.find(p => p.id === id)

  if (!patient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'var(--bg-page)' }}>
        <span className="text-5xl">🔍</span>
        <p className="font-medium text-primary">Paciente no encontrado</p>
        <button
          onClick={() => navigate('/')}
          className="btn-save-gradient px-4 py-2 text-sm text-white rounded-lg"
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
      <div className="navbar-gradient sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="navbar-subtitle hover:text-white transition-colors text-sm flex items-center gap-1"
          >
            ← Volver
          </button>
          <span className="text-white/30">|</span>
          <span className="text-white text-sm font-medium">Detalle del paciente</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="card rounded-2xl overflow-hidden">
          <div className="card-accent-bar h-2" />

          <div className="p-6">
            <div className="flex items-start gap-5 mb-6">
              <Avatar avatar={patient.avatar} name={patient.name} id={patient.id} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-semibold mb-1 text-primary">{patient.name}</h1>
                    <span className="badge-id text-sm px-3 py-1 rounded-full">
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
                <p className="text-xs font-medium mb-2 uppercase tracking-wide text-muted">Descripción</p>
                <p className="text-sm leading-relaxed text-secondary">{patient.description}</p>
              </div>

              <div className="card-divider-top pt-5">
                <p className="text-xs font-medium mb-3 uppercase tracking-wide text-muted">Información</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="modal-input rounded-xl p-3">
                    <p className="text-xs mb-1 text-muted">📅 Fecha de registro</p>
                    <p className="text-sm font-medium text-primary">{formatDate(patient.createdAt)}</p>
                  </div>
                  {websiteUrl && (
                    <div className="modal-input rounded-xl p-3">
                      <p className="text-xs mb-1 text-muted">🔗 Sitio web</p>
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-accent text-sm font-medium hover:underline truncate block"
                      >
                        {patient.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-divider-top pt-5">
                <button
                  onClick={() => openEdit(patient)}
                  className="btn-save-gradient w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
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