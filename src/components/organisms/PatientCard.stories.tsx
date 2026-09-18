import type { Meta, StoryObj } from '@storybook/react-vite'
import { PatientCard } from './PatientCard'
import { fn } from 'storybook/test'
import type { Patient } from '../../types'

const mockPatient: Patient = {
  id: '43',
  name: 'Hazel Nicolas',
  avatar: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/440.jpg',
  documentId: '30123456',
  birthDate: '1985-06-12',
  gender: 'femenino',
  phone: '+54 11 1234-5678',
  email: 'hazel.nicolas@mail.com',
  address: 'Av. Siempre Viva 742',
  bloodType: 'O+',
  allergies: '',
  medication: '',
  healthInsurance: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  tutorName: '',
  tutorPhone: '',
  diagnosis: 'Paciente con historial de hipertensión arterial. Requiere seguimiento mensual y control de presión.',
  assignedDoctor: 'Dra. Lucía Fernández',
  status: 'en_tratamiento',
  notes: '',
  notesHistory: [],
  attachments: [],
  createdAt: '2023-03-06T10:24:04.110Z',
}

const meta = {
  title: 'Organisms/PatientCard',
  component: PatientCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    patient: mockPatient,
    isFavorite: false,
    isRemoving: false,
    onToggleFavorite: fn() as (id: string) => void,
    onEdit: fn() as (patient: Patient) => void,
    onDelete: fn() as (patient: Patient) => void,
    onViewDetail: fn() as (patient: Patient) => void,
    viewMode: 'grid' as const,
  },
} satisfies Meta<typeof PatientCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Favorito: Story = {
  args: { isFavorite: true },
}

export const SinAvatar: Story = {
  args: {
    patient: { ...mockPatient, avatar: '' },
  },
}

export const VistaLista: Story = {
  args: { viewMode: 'list' },
}

export const Eliminando: Story = {
  args: { isRemoving: true },
}