import type { Doctor, UserRole } from '../types'
import { apiFetch } from './httpClient'

export async function getUsers(): Promise<Doctor[]> {
  return apiFetch<Doctor[]>('/users')
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

export async function deleteUser(id: string): Promise<void> {
  await apiFetch<void>(`/users/${id}`, { method: 'DELETE' })
}
