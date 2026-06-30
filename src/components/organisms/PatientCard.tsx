import { useNavigate } from 'react-router-dom'
import { Avatar } from '../atoms/Avatar'
import type { Patient } from '../../types'

interface PatientCardProps {
  patient: Patient
  isFavorite: boolean
  isNew?: boolean
  isRemoving?: boolean
  onToggleFavorite: (id: string) => void
  onEdit: (patient: Patient) => void
  onDelete: (patient: Patient) => void
  viewMode?: 'grid' | 'list'
}

export function PatientCard({ patient, isFavorite, isNew = false, isRemoving = false, onToggleFavorite, onEdit, onDelete, viewMode = 'grid' }: PatientCardProps) {
  const navigate = useNavigate()

  if (viewMode === 'list') {
    return (
      <div className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all hover:shadow-md card ${isRemoving ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
        <Avatar avatar={patient.avatar} name={patient.name} id={patient.id} size="sm" />
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/patient/${patient.id}`)}>
          <p className="font-semibold text-sm truncate font-display text-primary">{patient.name}</p>
          <p className="text-xs truncate text-muted">{patient.description}</p>
        </div>
        <span className="text-xs hidden sm:block px-2 py-0.5 rounded-full badge-id">#{patient.id}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => onToggleFavorite(patient.id)} className="text-lg transition-transform hover:scale-110">
            <span className={isFavorite ? 'star-active' : 'star-inactive'}>★</span>
          </button>
          <button onClick={() => onEdit(patient)} className="text-xs px-3 py-1 rounded-lg font-medium icon-btn-edit">✏️</button>
          <button onClick={() => onDelete(patient)} className="text-xs px-3 py-1 rounded-lg font-medium icon-btn-delete">🗑️</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 card ${isRemoving ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
      <div className="h-1.5 card-accent-bar" />
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="cursor-pointer flex-shrink-0" onClick={() => navigate(`/patient/${patient.id}`)}>
            <Avatar avatar={patient.avatar} name={patient.name} id={patient.id} size="md" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 cursor-pointer" onClick={() => navigate(`/patient/${patient.id}`)}>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold truncate font-display text-primary">{patient.name}</p>
                  {isNew && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 badge-new">
                      ✦ Nuevo
                    </span>
                  )}
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full inline-block mt-0.5 badge-id">
                  ID #{patient.id}
                </span>
              </div>
              <button onClick={() => onToggleFavorite(patient.id)} className="text-xl transition-transform hover:scale-125 flex-shrink-0">
                <span className={isFavorite ? 'star-active' : 'star-inactive'}>★</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm line-clamp-2 mb-4 leading-relaxed text-secondary">
          {patient.description}
        </p>

        <div className="flex items-center justify-between pt-3 card-divider-top">
          <button
            onClick={() => navigate(`/patient/${patient.id}`)}
            className="text-xs font-semibold flex items-center gap-1 transition-all hover:gap-2 link-accent"
          >
            Ver detalle →
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(patient)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 icon-btn-edit"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(patient)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 icon-btn-delete"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}