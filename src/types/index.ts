export interface Patient {
  id: string
  name: string
  avatar: string | object
  description: string
  website: string
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