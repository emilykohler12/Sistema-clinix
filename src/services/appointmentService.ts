import type { Appointment, CancelReason, PaymentType } from '../types'
import { apiFetch } from './httpClient'

interface GetAppointmentsOptions {
  start?: string
  end?: string
  professional?: string
  patient?: string
  upcoming?: boolean
}

export async function getAppointments(options: GetAppointmentsOptions = {}): Promise<Appointment[]> {
  const params = new URLSearchParams()
  if (options.start) params.append('start', options.start)
  if (options.end) params.append('end', options.end)
  if (options.professional) params.append('professional', options.professional)
  if (options.patient) params.append('patient', options.patient)
  if (options.upcoming) params.append('upcoming', 'true')

  const query = params.toString()
  return apiFetch<Appointment[]>(`/appointments${query ? `?${query}` : ''}`)
}

export interface NewAppointmentInput {
  patient: string
  professional: string
  date: string
  duration?: number
  price?: number
  paymentType?: PaymentType
}

export async function createAppointment(input: NewAppointmentInput): Promise<Appointment> {
  return apiFetch<Appointment>('/appointments', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function updateAppointment(id: string, input: Partial<Appointment>): Promise<Appointment> {
  return apiFetch<Appointment>(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export async function completeAppointment(id: string, note?: string, paid?: boolean): Promise<Appointment> {
  return apiFetch<Appointment>(`/appointments/${id}/complete`, {
    method: 'POST',
    body: JSON.stringify({ note, paid }),
  })
}

export async function cancelAppointment(id: string, reason: CancelReason = 'cancelado', newDate?: string): Promise<Appointment> {
  return apiFetch<Appointment>(`/appointments/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason, newDate }),
  })
}

export async function markNoShow(id: string): Promise<Appointment> {
  return apiFetch<Appointment>(`/appointments/${id}/no-show`, { method: 'POST' })
}
