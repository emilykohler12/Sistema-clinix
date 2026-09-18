import type { BloodType, Doctor, Gender, PatientFilters, PatientStatus } from '../../types'

interface FilterBarProps {
  filters: PatientFilters
  onChange: (filters: PatientFilters) => void
  doctors: Doctor[]
}

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'femenino', label: 'Femenino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'otro', label: 'Otro' },
]

const statusOptions: { value: PatientStatus; label: string }[] = [
  { value: 'activo', label: 'Activo' },
  { value: 'en_tratamiento', label: 'En tratamiento' },
  { value: 'en_espera', label: 'En espera' },
  { value: 'internado', label: 'Internado' },
  { value: 'derivado', label: 'Derivado' },
  { value: 'de_alta', label: 'De alta' },
]

const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export function FilterBar({ filters, onChange, doctors }: FilterBarProps) {
  const selectClass = "card px-3 py-2 rounded-xl text-sm focus:outline-none text-primary"

  return (
    <div className="flex items-center gap-2 flex-wrap mb-6">
      <select
        value={filters.gender ?? ''}
        onChange={e => onChange({ ...filters, gender: (e.target.value as Gender) || undefined })}
        className={selectClass}
      >
        <option value="">Género (todos)</option>
        {genderOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
      </select>

      <select
        value={filters.status ?? ''}
        onChange={e => onChange({ ...filters, status: (e.target.value as PatientStatus) || undefined })}
        className={selectClass}
      >
        <option value="">Estado (todos)</option>
        {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>

      <select
        value={filters.assignedDoctor ?? ''}
        onChange={e => onChange({ ...filters, assignedDoctor: e.target.value || undefined })}
        className={selectClass}
      >
        <option value="">Profesional (todos)</option>
        {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
      </select>

      <select
        value={filters.bloodType ?? ''}
        onChange={e => onChange({ ...filters, bloodType: (e.target.value as BloodType) || undefined })}
        className={selectClass}
      >
        <option value="">Grupo sanguíneo (todos)</option>
        {bloodTypes.map(bt => <option key={bt} value={bt}>{bt}</option>)}
      </select>
    </div>
  )
}
