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

export function PatientInfoGrid({ patient, formatDate }: PatientInfoGridProps) {
  const items: InfoItem[] = [
    { label: 'Fecha de nacimiento', value: patient.birthDate ? formatDate(patient.birthDate) : 'Sin registrar' },
    { label: 'Género', value: genderLabel[patient.gender] },
    { label: 'Grupo sanguíneo', value: patient.bloodType || 'Sin registrar' },
    { label: 'Estado', value: statusLabel[patient.status] },
    { label: 'Teléfono', value: patient.phone || 'Sin registrar' },
    { label: 'Email', value: patient.email || 'Sin registrar' },
    { label: 'Dirección', value: patient.address || 'Sin registrar' },
    { label: 'Médico asignado', value: patient.assignedDoctor || 'Sin asignar' },
    { label: 'Fecha de registro', value: formatDate(patient.createdAt) },
  ]

  return (
    <div className="flex flex-col gap-5">
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
          <p className="text-xs font-medium mb-2 uppercase tracking-wide text-muted">Notas</p>
          <p className="text-sm leading-relaxed text-secondary">{patient.notes}</p>
        </div>
      )}
    </div>
  )
}
