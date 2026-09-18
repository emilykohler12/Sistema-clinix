import { useEffect, useState } from 'react'
import { useClinicStore } from '../../store/useClinicStore'
import { getPatients } from '../../services/patientService'
import type { Appointment, Patient, PaymentType } from '../../types'

interface AppointmentModalProps {
  initialDate: Date
  appointment?: Appointment
  onClose: () => void
}

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function AppointmentModal({ initialDate, appointment, onClose }: AppointmentModalProps) {
  const { doctors, loadDoctors, createAppointment, updateAppointment, completeAppointment, cancelAppointment, addToast } = useClinicStore()
  const [patients, setPatients] = useState<Patient[]>([])

  useEffect(() => {
    if (doctors.length === 0) loadDoctors()
    getPatients(1, 500, {}).then(res => setPatients(res.items)).catch(() => setPatients([]))
  }, [])

  const [patientId, setPatientId] = useState(appointment?.patient.id ?? '')
  const [professionalId, setProfessionalId] = useState(appointment?.professional.id ?? '')
  const [dateValue, setDateValue] = useState(toLocalInputValue(appointment ? new Date(appointment.date) : initialDate))
  const [duration, setDuration] = useState(appointment?.duration ?? 30)
  const [price, setPrice] = useState(appointment?.price ?? 0)
  const [paymentType, setPaymentType] = useState<PaymentType>(appointment?.paymentType ?? 'particular')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!appointment
  const inputClass = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none modal-input"
  const labelClass = "text-sm mb-1 block text-secondary"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!patientId || !professionalId) {
      setError('Elegí un paciente y un profesional')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const isoDate = new Date(dateValue).toISOString()
      if (isEditing) {
        await updateAppointment(appointment.id, {
          date: isoDate,
          duration,
          price,
          paymentType,
        } as Partial<Appointment>)
        addToast('Turno actualizado', 'success')
      } else {
        await createAppointment({ patient: patientId, professional: professionalId, date: isoDate, duration, price, paymentType })
        addToast('Turno agendado', 'success')
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el turno')
    } finally {
      setSaving(false)
    }
  }

  async function handleComplete() {
    if (!appointment) return
    setSaving(true)
    try {
      await completeAppointment(appointment.id, note.trim() || undefined, true)
      addToast('Consulta completada', 'success')
      onClose()
    } catch {
      addToast('No se pudo completar la consulta', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleCancel() {
    if (!appointment) return
    if (!window.confirm('¿Cancelar este turno?')) return
    setSaving(true)
    try {
      await cancelAppointment(appointment.id)
      addToast('Turno cancelado', 'success')
      onClose()
    } catch {
      addToast('No se pudo cancelar el turno', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overlay">
      <div className="rounded-2xl w-full max-w-md flex flex-col card" style={{ maxHeight: '90vh' }}>
        <div className="flex items-center justify-between p-6 pb-0 flex-shrink-0">
          <h2 className="text-lg font-medium text-primary">{isEditing ? 'Editar turno' : 'Nuevo turno'}</h2>
          <button onClick={onClose} className="text-xl hover:opacity-70 text-muted">×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-6 overflow-y-auto">
          <div>
            <label className={labelClass}>Paciente *</label>
            <select value={patientId} onChange={e => setPatientId(e.target.value)} className={inputClass} disabled={isEditing}>
              <option value="">Elegir paciente</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name} — DNI {p.documentId}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Profesional *</label>
            <select value={professionalId} onChange={e => setProfessionalId(e.target.value)} className={inputClass} disabled={isEditing}>
              <option value="">Elegir profesional</option>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Fecha y hora *</label>
            <input type="datetime-local" value={dateValue} onChange={e => setDateValue(e.target.value)} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Duración (min)</label>
              <input type="number" min={5} step={5} value={duration} onChange={e => setDuration(Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Precio</label>
              <input type="number" min={0} value={price} onChange={e => setPrice(Number(e.target.value))} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Tipo de pago</label>
            <select value={paymentType} onChange={e => setPaymentType(e.target.value as PaymentType)} className={inputClass}>
              <option value="particular">Particular</option>
              <option value="obra_social">Obra social</option>
            </select>
          </div>

          {isEditing && appointment.status !== 'completado' && appointment.status !== 'cancelado' && (
            <div className="card-divider-top" style={{ paddingTop: '1rem' }}>
              <label className={labelClass}>Nota rápida al completar (opcional)</label>
              <input type="text" value={note} onChange={e => setNote(e.target.value)} className={inputClass} placeholder="Se atendió por..." />
            </div>
          )}

          {error && <p className="text-xs text-error">{error}</p>}

          <div className="flex flex-col gap-2 mt-2">
            <button type="submit" disabled={saving} className="px-4 py-2.5 text-sm text-white rounded-lg btn-save-gradient disabled:opacity-60">
              {isEditing ? 'Guardar cambios' : 'Agendar turno'}
            </button>
            {isEditing && appointment.status !== 'completado' && appointment.status !== 'cancelado' && (
              <>
                <button type="button" onClick={handleComplete} disabled={saving} className="px-4 py-2 text-sm rounded-lg icon-btn-edit disabled:opacity-60">
                  Completar consulta
                </button>
                <button type="button" onClick={handleCancel} disabled={saving} className="px-4 py-2 text-sm rounded-lg icon-btn-delete disabled:opacity-60">
                  Cancelar turno
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
