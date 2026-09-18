const BASE_URL = import.meta.env.VITE_API_URL

function getToken(): string | null {
  return localStorage.getItem('clinix_token')
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (response.status === 401) {
    localStorage.removeItem('clinix_token')
    localStorage.removeItem('clinix_user')
    window.location.href = '/login'
    throw new ApiError('No autenticado', 401)
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(body?.message ?? 'Error en la solicitud', response.status)
  }

  if (response.status === 204) return undefined as T
  return response.json()
}
