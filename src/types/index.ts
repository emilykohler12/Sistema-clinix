export type Gender = 'femenino' | 'masculino' | 'otro'
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | ''
export type PatientStatus =
  | 'activo'
  | 'en_tratamiento'
  | 'en_espera'
  | 'internado'
  | 'derivado'
  | 'de_alta'

export interface Patient {
  id: string
  name: string
  documentId: string
  birthDate?: string
  gender: Gender
  phone: string
  email: string
  address: string
  bloodType: BloodType
  allergies: string
  diagnosis: string
  assignedDoctor: string
  status: PatientStatus
  notes: string
  avatar: string | object
  archived?: boolean
  createdAt: string
}

export type SortOption = 'az' | 'za'

export type ViewMode = 'grid' | 'list'

export type ToastType = 'success' | 'error'

export interface Toast {
  id: string
  message: string
  type: ToastType
}
export interface StatsData {
  total: number
  favorites: number
  addedThisSession: number
}

export type UserRole = 'admin' | 'medico'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  specialty?: string
}

export interface Doctor {
  id: string
  name: string
  email: string
  role: UserRole
  specialty?: string
  avatar?: string
  active: boolean
  archived?: boolean
  createdAt: string
}

export interface PatientFilters {
  gender?: Gender
  status?: PatientStatus
  assignedDoctor?: string
  bloodType?: BloodType
}
