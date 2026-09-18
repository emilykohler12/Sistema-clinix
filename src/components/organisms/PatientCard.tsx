import { Avatar } from '../atoms/Avatar'
import type { Patient } from '../../types'

const statusLabel: Record<Patient['status'], string> = {
  activo: 'Activo',
  en_tratamiento: 'En tratamiento',
  en_espera: 'En espera',
  internado: 'Internado',
  derivado: 'Derivado',
  de_alta: 'De alta',
}

const statusClass: Record<Patient['status'], string> = {
  activo: 'badge-status-active',
  en_tratamiento: 'badge-status-treatment',
  en_espera: 'badge-status-waiting',
  internado: 'badge-status-admitted',
  derivado: 'badge-status-referred',
  de_alta: 'badge-status-discharged',
}

interface PatientCardProps {
  patient: Patient
  isFavorite: boolean
  isRemoving?: boolean
  onToggleFavorite: (id: string) => void
  onEdit: (patient: Patient) => void
  onDelete: (patient: Patient) => void
  onViewDetail: (patient: Patient) => void
  viewMode?: 'grid' | 'list'
  archived?: boolean
  onRestore?: (patient: Patient) => void
}

export function PatientCard({
  patient, isFavorite, isRemoving = false,
  onToggleFavorite, onEdit, onDelete, onViewDetail, viewMode = 'grid',
  archived = false, onRestore,
}: PatientCardProps) {

  if (viewMode === 'list') {
    return (
      <div className={`flex items-center gap-4 px-4 py-3 rounded-2xl card ${isRemoving ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
        <Avatar avatar={patient.avatar} name={patient.name} id={patient.id} size="sm" />
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onViewDetail(patient)}>
          <p className="font-semibold text-sm truncate text-primary">{patient.name}</p>
          <p className="text-xs truncate text-muted">{patient.diagnosis || 'Sin diagnóstico registrado'}</p>
        </div>
        <span className={`text-xs hidden sm:block px-2 py-0.5 rounded-full ${statusClass[patient.status]}`}>{statusLabel[patient.status]}</span>
        <div className="flex items-center gap-2">
          {archived ? (
            <button onClick={() => onRestore?.(patient)} className="text-xs px-3 py-1 rounded-lg font-medium icon-btn-edit">Restaurar</button>
          ) : (
            <>
              <button onClick={() => onToggleFavorite(patient.id)} className="text-lg transition-transform hover:scale-110">
                <span className={isFavorite ? 'star-active' : 'star-inactive'}>★</span>
              </button>
              <button onClick={() => onEdit(patient)} className="text-xs px-3 py-1 rounded-lg font-medium icon-btn-edit">Editar</button>
              <button onClick={() => onDelete(patient)} className="text-xs px-3 py-1 rounded-lg font-medium icon-btn-delete">Eliminar</button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl overflow-hidden card ${isRemoving ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
      <div className="h-1.5 card-accent-bar" />
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="cursor-pointer flex-shrink-0" onClick={() => onViewDetail(patient)}>
            <Avatar avatar={patient.avatar} name={patient.name} id={patient.id} size="md" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 cursor-pointer" onClick={() => onViewDetail(patient)}>
                <p className="font-bold truncate text-primary">{patient.name}</p>
                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full inline-block ${statusClass[patient.status]}`}>
                    {statusLabel[patient.status]}
                  </span>
                </div>
              </div>
              {!archived && (
                <button onClick={() => onToggleFavorite(patient.id)} className="text-xl transition-transform hover:scale-125 flex-shrink-0">
                  <span className={isFavorite ? 'star-active' : 'star-inactive'}>★</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm line-clamp-2 mb-1 leading-relaxed text-secondary">
          {patient.diagnosis || 'Sin diagnóstico registrado'}
        </p>
        <p className="text-xs mb-4 text-muted">
          {patient.assignedDoctor || ' '}
        </p>

        <div className="flex items-center justify-between pt-3 card-divider-top">
          <button
            onClick={() => onViewDetail(patient)}
            className="text-xs font-semibold flex items-center gap-1 transition-all hover:gap-2 link-accent"
          >
            Ver detalle (DNI {patient.documentId}) →
          </button>
          <div className="flex gap-2">
            {archived ? (
              <button
                onClick={() => onRestore?.(patient)}
                className="text-xs px-3 py-1.5 rounded-lg font-medium icon-btn-edit"
              >
                Restaurar
              </button>
            ) : (
              <>
                <button
                  onClick={() => onEdit(patient)}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium icon-btn-edit"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(patient)}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium icon-btn-delete"
                >
                  Eliminar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
