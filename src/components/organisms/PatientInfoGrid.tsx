import { NotesTimeline } from './NotesTimeline'
import { AttachmentsList } from './AttachmentsList'
import { useClinicStore } from '../../store/useClinicStore'
import { timeSince, daysSince, calculateAge } from '../../utils/formatDate'
import type { Patient } from '../../types'

const statusLabel: Record<Patient['status'], string> = {
  activo: 'Activo',
  en_tratamiento: 'En tratamiento',
  en_espera: 'En espera',
  internado: 'Internado',
  derivado: 'Derivado',
  de_alta: 'De alta',
}

const genderLabel: Record<Patient['gender'], string> = {
  femenino: 'Femenino',
  masculino: 'Masculino',
  otro: 'Otro',
}

interface InfoItem {
  label: string
  value: string
}

interface PatientInfoGridProps {
  patient: Patient
  formatDate: (iso: string) => string
}

const LONG_ABSENCE_DAYS = 60

export function PatientInfoGrid({ patient, formatDate }: PatientInfoGridProps) {
  const { addNote, removeNote, uploadAttachment, removeAttachment } = useClinicStore()

  const isMinor = patient.birthDate ? calculateAge(patient.birthDate) < 18 : false
  const longAbsence = patient.lastVisitAt ? daysSince(patient.lastVisitAt) >= LONG_ABSENCE_DAYS : false

  const items: InfoItem[] = [
    { label: 'Fecha de nacimiento', value: patient.birthDate ? formatDate(patient.birthDate) : 'Sin registrar' },
    { label: 'Género', value: genderLabel[patient.gender] },
    { label: 'Grupo sanguíneo', value: patient.bloodType || 'Sin registrar' },
    { label: 'Estado', value: statusLabel[patient.status] },
    { label: 'Peso', value: patient.weight ? `${patient.weight} kg` : 'Sin registrar' },
    { label: 'Altura', value: patient.height ? `${patient.height} cm` : 'Sin registrar' },
    { label: 'Teléfono', value: patient.phone || 'Sin registrar' },
    { label: 'Email', value: patient.email || 'Sin registrar' },
    { label: 'Dirección', value: patient.address || 'Sin registrar' },
    { label: 'Obra social', value: patient.healthInsurance || 'Particular' },
    { label: 'Contacto de emergencia', value: patient.emergencyContactName ? `${patient.emergencyContactName}${patient.emergencyContactPhone ? ` · ${patient.emergencyContactPhone}` : ''}` : 'Sin registrar' },
    { label: 'Profesional asignado', value: patient.assignedDoctor || 'Sin asignar' },
    { label: 'Fecha de registro', value: formatDate(patient.createdAt) },
  ]

  if (isMinor) {
    items.push({
      label: 'Tutor / responsable',
      value: patient.tutorName ? `${patient.tutorName}${patient.tutorPhone ? ` · ${patient.tutorPhone}` : ''}` : 'Sin registrar',
    })
  }

  return (
    <div className="flex flex-col gap-5">
      {patient.lastVisitAt && (
        <div className={`rounded-xl p-3 ${longAbsence ? 'badge-status-admitted' : 'info-tile'}`}>
          <p className="text-xs mb-1 uppercase tracking-wide opacity-80">Última consulta</p>
          <p className="text-sm font-medium">
            {formatDate(patient.lastVisitAt)} ({timeSince(patient.lastVisitAt)})
            {longAbsence && ' — hace tiempo que no viene'}
          </p>
        </div>
      )}

      <div>
        <p className="text-xs font-medium mb-2 uppercase tracking-wide text-muted">Diagnóstico</p>
        <p className="text-sm leading-relaxed text-secondary">{patient.diagnosis || 'Sin diagnóstico registrado'}</p>
      </div>

      {patient.allergies && (
        <div>
          <p className="text-xs font-medium mb-2 uppercase tracking-wide text-muted">Alergias</p>
          <p className="text-sm leading-relaxed text-error">{patient.allergies}</p>
        </div>
      )}

      {patient.medication && (
        <div>
          <p className="text-xs font-medium mb-2 uppercase tracking-wide text-muted">Medicación actual</p>
          <p className="text-sm leading-relaxed text-secondary">{patient.medication}</p>
        </div>
      )}

      <div className="card-divider-top" style={{ paddingTop: '1.25rem' }}>
        <p className="text-xs font-medium mb-3 uppercase tracking-wide text-muted">Información</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map(item => (
            <div key={item.label} className="rounded-xl p-3 info-tile">
              <p className="text-xs mb-1 text-muted">{item.label}</p>
              <p className="text-sm font-medium truncate text-primary">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {patient.notes && (
        <div className="card-divider-top" style={{ paddingTop: '1.25rem' }}>
          <p className="text-xs font-medium mb-2 uppercase tracking-wide text-muted">Notas generales</p>
          <p className="text-sm leading-relaxed text-secondary">{patient.notes}</p>
        </div>
      )}

      <div className="card-divider-top" style={{ paddingTop: '1.25rem' }}>
        <NotesTimeline
          notes={patient.notesHistory}
          onAdd={(text) => addNote(patient.id, text)}
          onRemove={(noteId) => removeNote(patient.id, noteId)}
        />
      </div>

      <div className="card-divider-top" style={{ paddingTop: '1.25rem' }}>
        <AttachmentsList
          attachments={patient.attachments}
          onUpload={(file) => uploadAttachment(patient.id, file)}
          onRemove={(attachmentId) => removeAttachment(patient.id, attachmentId)}
        />
      </div>
    </div>
  )
}
