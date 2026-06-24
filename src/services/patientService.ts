import type { Patient } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL

export async function getPatients(page: number, limit: number): Promise<Patient[]> {
  const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`)

  if (!response.ok) {
    throw new Error('Error al obtener los pacientes')
  }

  const data = await response.json()
  return data
}