import type { Patient, PatientFilters } from '../types'
import { apiFetch } from './httpClient'

interface PatientsResponse {
  items: Patient[]
  total: number
  page: number
  hasMore: boolean
}

interface GetPatientsOptions {
  search?: string
  year?: string
  archived?: boolean
  filters?: PatientFilters
}

export async function getPatients(
  page: number,
  limit: number,
  options: GetPatientsOptions = {}
): Promise<PatientsResponse> {
  const { search, year, archived, filters } = options
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (search && search.trim() !== '') params.append('search', search.trim())
  if (year && year !== 'all') params.append('year', year)
  if (archived) params.append('archived', 'true')
  if (filters?.gender) params.append('gender', filters.gender)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.assignedDoctor) params.append('assignedDoctor', filters.assignedDoctor)
  if (filters?.bloodType) params.append('bloodType', filters.bloodType)

  return apiFetch<PatientsResponse>(`/patients?${params.toString()}`)
}

export async function getAvailableYears(): Promise<number[]> {
  return apiFetch<number[]>('/patients/years')
}

export async function getPatientById(id: string): Promise<Patient> {
  return apiFetch<Patient>(`/patients/${id}`)
}

export async function createPatient(patient: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient> {
  return apiFetch<Patient>('/patients', {
    method: 'POST',
    body: JSON.stringify(patient),
  })
}

export async function updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
  return apiFetch<Patient>(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patient),
  })
}

export async function archivePatient(id: string): Promise<Patient> {
  return apiFetch<Patient>(`/patients/${id}`, { method: 'DELETE' })
}

export async function restorePatient(id: string): Promise<Patient> {
  return apiFetch<Patient>(`/patients/${id}/restore`, { method: 'POST' })
}

export async function deletePatientPermanently(id: string): Promise<void> {
  await apiFetch<void>(`/patients/${id}?permanent=true`, { method: 'DELETE' })
}
