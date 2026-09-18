import type { Doctor, UserRole } from '../types'
import { apiFetch } from './httpClient'

export async function getUsers(archived = false): Promise<Doctor[]> {
  return apiFetch<Doctor[]>(`/users${archived ? '?archived=true' : ''}`)
}

export interface NewDoctorInput {
  name: string
  email: string
  password: string
  specialty?: string
  role?: UserRole
}

export async function createUser(input: NewDoctorInput): Promise<Doctor> {
  return apiFetch<Doctor>('/users', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function setUserActive(id: string, active: boolean): Promise<Doctor> {
  return apiFetch<Doctor>(`/users/${id}/active`, {
    method: 'PATCH',
    body: JSON.stringify({ active }),
  })
}

export async function archiveUser(id: string): Promise<Doctor> {
  return apiFetch<Doctor>(`/users/${id}`, { method: 'DELETE' })
}

export async function restoreUser(id: string): Promise<Doctor> {
  return apiFetch<Doctor>(`/users/${id}/restore`, { method: 'POST' })
}
