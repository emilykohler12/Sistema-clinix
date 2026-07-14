import type { Meta, StoryObj } from '@storybook/react-vite'
import { PatientCard } from './PatientCard'
import { fn } from 'storybook/test'

const mockPatient = {
  id: '43',
  name: 'Hazel Nicolas',
  avatar: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/440.jpg',
  description: 'Paciente con historial de hipertensión arterial. Requiere seguimiento mensual y control de presión.',
  website: 'https://ejemplo.com',
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
    isNew: false,
    isRemoving: false,
    onToggleFavorite: fn(),
    onEdit: fn(),
    onDelete: fn(),
    viewMode: 'grid',
  },
} satisfies Meta<typeof PatientCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Favorito: Story = {
  args: { isFavorite: true },
}

export const Nuevo: Story = {
  args: { isNew: true },
}

export const NuevoYFavorito: Story = {
  args: { isFavorite: true, isNew: true },
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