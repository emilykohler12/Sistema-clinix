import type { AuthUser } from '../types'
import { apiFetch } from './httpClient'

interface LoginResponse {
  token: string
  user: AuthUser
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const data = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  localStorage.setItem('clinix_token', data.token)
  localStorage.setItem('clinix_user', JSON.stringify(data.user))
  return data.user
}

export async function register(name: string, email: string, password: string, specialty?: string): Promise<AuthUser> {
  const data = await apiFetch<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, specialty }),
  })
  localStorage.setItem('clinix_token', data.token)
  localStorage.setItem('clinix_user', JSON.stringify(data.user))
  return data.user
}

export function logout() {
  localStorage.removeItem('clinix_token')
  localStorage.removeItem('clinix_user')
}

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem('clinix_user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem('clinix_token'))
}
