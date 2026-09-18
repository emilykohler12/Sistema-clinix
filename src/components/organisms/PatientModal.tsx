import { useState, useEffect } from 'react'
import type { BloodType, Gender, Patient, PatientStatus } from '../../types'
import { ImageUpload } from '../molecules/ImageUpload'
import { useClinicStore } from '../../store/useClinicStore'

interface PatientModalProps {
  mode: 'add' | 'edit'
  patient?: Patient
  onSave: (patient: Patient) => void
  onClose: () => void
}

interface FormErrors {
  name?: string
  documentId?: string
  email?: string
}

const bloodTypes: BloodType[] = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const statuses: { value: PatientStatus; label: string }[] = [
  { value: 'activo', label: 'Activo' },
  { value: 'en_tratamiento', label: 'En tratamiento' },
  { value: 'en_espera', label: 'En espera' },
  { value: 'internado', label: 'Internado' },
  { value: 'derivado', label: 'Derivado' },
  { value: 'de_alta', label: 'De alta' },
]

export function PatientModal({ mode, patient, onSave, onClose }: PatientModalProps) {
  const [name, setName] = useState(patient?.name ?? '')
  const [documentId, setDocumentId] = useState(patient?.documentId ?? '')
  const [birthDate, setBirthDate] = useState(patient?.birthDate?.split('T')[0] ?? '')
  const [gender, setGender] = useState<Gender>(patient?.gender ?? 'otro')
  const [phone, setPhone] = useState(patient?.phone ?? '')
  const [email, setEmail] = useState(patient?.email ?? '')
  const [address, setAddress] = useState(patient?.address ?? '')
  const [bloodType, setBloodType] = useState<BloodType>(patient?.bloodType ?? '')
  const [allergies, setAllergies] = useState(patient?.allergies ?? '')
  const [diagnosis, setDiagnosis] = useState(patient?.diagnosis ?? '')
  const [assignedDoctor, setAssignedDoctor] = useState(patient?.assignedDoctor ?? '')
  const [status, setStatus] = useState<PatientStatus>(patient?.status ?? 'activo')
  const [notes, setNotes] = useState(patient?.notes ?? '')
  const [avatar, setAvatar] = useState(typeof patient?.avatar === 'string' ? patient.avatar : '')
  const [errors, setErrors] = useState<FormErrors>({})
  const { doctors, loadDoctors } = useClinicStore()

  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [])

  useEffect(() => {
    if (doctors.length === 0) loadDoctors()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!name.trim()) newErrors.name = 'El nombre es requerido'
    if (!documentId.trim()) newErrors.documentId = 'El documento es requerido'
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Email inválido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSave() {
    if (!validate()) return
    const saved: Patient = {
      id: patient?.id ?? '',
      name: name.trim(),
      documentId: documentId.trim(),
      birthDate: birthDate || undefined,
      gender,
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      bloodType,
      allergies: allergies.trim(),
      diagnosis: diagnosis.trim(),
      assignedDoctor: assignedDoctor.trim(),
      status,
      notes: notes.trim(),
      avatar: avatar.trim(),
      createdAt: patient?.createdAt ?? new Date().toISOString(),
    }
    onSave(saved)
  }

  const inputClass = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 modal-input"
  const labelClass = "text-sm mb-1 block text-secondary"

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overlay">
      <div className="rounded-2xl w-full max-w-lg flex flex-col card" style={{ maxHeight: '90vh' }}>
        <div className="flex items-center justify-between p-6 pb-0 flex-shrink-0">
          <h2 className="text-lg font-medium text-primary">
            {mode === 'add' ? 'Agregar paciente' : 'Editar paciente'}
          </h2>
          <button onClick={onClose} className="text-xl hover:opacity-70 text-muted">×</button>
        </div>

        <div className="flex flex-col gap-3 p-6 overflow-y-auto">
          <ImageUpload value={avatar} onChange={setAvatar} name={name || 'Paciente'} id={patient?.id ?? 'new'} />

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelClass}>Nombre completo *</label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })) }}
                className={inputClass}
                placeholder="Nombre y apellido"
              />
              {errors.name && <p className="text-xs mt-1 text-error">{errors.name}</p>}
            </div>

            <div>
              <label className={labelClass}>Documento (DNI) *</label>
              <input
                type="text"
                value={documentId}
                onChange={e => { setDocumentId(e.target.value); setErrors(prev => ({ ...prev, documentId: undefined })) }}
                className={inputClass}
                placeholder="12345678"
              />
              {errors.documentId && <p className="text-xs mt-1 text-error">{errors.documentId}</p>}
            </div>

            <div>
              <label className={labelClass}>Fecha de nacimiento</label>
              <input
                type="date"
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Género</label>
              <select value={gender} onChange={e => setGender(e.target.value as Gender)} className={inputClass}>
                <option value="femenino">Femenino</option>
                <option value="masculino">Masculino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Grupo sanguíneo</label>
              <select value={bloodType} onChange={e => setBloodType(e.target.value as BloodType)} className={inputClass}>
                {bloodTypes.map(bt => <option key={bt} value={bt}>{bt || 'Sin definir'}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Teléfono</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="+54 11 1234-5678" />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })) }}
                className={inputClass}
                placeholder="paciente@mail.com"
              />
              {errors.email && <p className="text-xs mt-1 text-error">{errors.email}</p>}
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Dirección</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Médico asignado</label>
              <select value={assignedDoctor} onChange={e => setAssignedDoctor(e.target.value)} className={inputClass}>
                <option value="">Sin asignar</option>
                {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Estado</label>
              <select value={status} onChange={e => setStatus(e.target.value as PatientStatus)} className={inputClass}>
                {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Alergias</label>
              <input type="text" value={allergies} onChange={e => setAllergies(e.target.value)} className={inputClass} placeholder="Ninguna conocida" />
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Diagnóstico</label>
              <textarea value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className={inputClass} rows={2} style={{ resize: 'vertical' }} />
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Notas</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} rows={2} style={{ resize: 'vertical' }} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 pt-2 flex-shrink-0 card-divider-top">
          <button onClick={onClose} className="px-4 py-2 text-sm transition-colors text-secondary">Cancelar</button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm text-white rounded-lg transition-colors hover:opacity-90 btn-save-gradient"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
