import type { Patient } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL

export async function getPatients(page: number, limit: number, search?: string): Promise<Patient[]> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })
  if (search && search.trim() !== '') {
    params.append('name', search.trim())
  }
  const response = await fetch(`${BASE_URL}?${params.toString()}`)
  if (!response.ok) throw new Error('Error al obtener los pacientes')
  return response.json()
}