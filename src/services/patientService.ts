import type { Patient } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL

export async function getPatients(
  page: number,
  limit: number,
  search?: string
): Promise<Patient[]> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: 'name',
    order: 'asc',
  })
  if (search && search.trim() !== '') {
    params.append('name', search.trim())
  }
  const response = await fetch(`${BASE_URL}?${params.toString()}`)
  if (!response.ok) throw new Error('Error al obtener los pacientes')
  return response.json()
}

export async function getAllPatientsByYear(year: string): Promise<Patient[]> {
  // La API no filtra por año, así que traemos todo de a páginas y filtramos
  const allPatients: Patient[] = []
  let currentPage = 1
  const limit = 100

  while (true) {
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(limit),
      sortBy: 'name',
      order: 'asc',
    })
    const response = await fetch(`${BASE_URL}?${params.toString()}`)
    if (!response.ok) throw new Error('Error al obtener los pacientes')
    const data: Patient[] = await response.json()

    const ofYear = data.filter(
      p => new Date(p.createdAt).getFullYear().toString() === year
    )
    allPatients.push(...ofYear)

    if (data.length < limit) break
    currentPage++
  }

  return allPatients
}