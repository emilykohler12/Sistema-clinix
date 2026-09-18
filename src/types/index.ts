export type Gender = 'femenino' | 'masculino' | 'otro'
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | ''
export type PatientStatus =
  | 'activo'
  | 'en_tratamiento'
  | 'en_espera'
  | 'internado'
  | 'derivado'
  | 'de_alta'

export interface Attachment {
  id: string
  filename: string
  url: string
  mimeType: string
  uploadedAt: string
}

export interface NoteEntry {
  id: string
  text: string
  date: string
}

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
  medication: string
  weight?: number
  height?: number
  healthInsurance: string
  emergencyContactName: string
  emergencyContactPhone: string
  tutorName: string
  tutorPhone: string
  diagnosis: string
  assignedDoctor: string
  status: PatientStatus
  notes: string
  notesHistory: NoteEntry[]
  attachments: Attachment[]
  avatar: string | object
  archived?: boolean
  lastVisitAt?: string
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

export type AppointmentStatus = 'programado' | 'confirmado' | 'completado' | 'cancelado' | 'no_asistio'
export type PaymentType = 'obra_social' | 'particular'
export type CancelReason = 'cancelado' | 'reprogramado'

export interface AppointmentPatientRef {
  id: string
  name: string
  documentId: string
  phone: string
  email: string
}

export interface AppointmentProfessionalRef {
  id: string
  name: string
  specialty?: string
}

export interface Appointment {
  id: string
  patient: AppointmentPatientRef
  professional: AppointmentProfessionalRef
  date: string
  duration: number
  price: number
  paid: boolean
  paymentType: PaymentType
  status: AppointmentStatus
  cancelReason?: CancelReason | null
  rescheduledTo?: string | null
  reminderSentAt?: string | null
  createdAt: string
}
