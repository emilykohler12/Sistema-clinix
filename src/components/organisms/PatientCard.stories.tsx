import type { Meta, StoryObj } from '@storybook/react'
import { PatientCard } from './PatientCard'

const meta: Meta<typeof PatientCard> = {
  title: 'Organisms/PatientCard',
  component: PatientCard,
}
export default meta

type Story = StoryObj<typeof PatientCard>

const pacienteBase = {
  id: '1',
  name: 'María López',
  avatar: 'https://i.pravatar.cc/150?img=5',
  description: 'Paciente con historial de hipertensión y diabetes tipo 2.',
  website: 'https://ejemplo.com',
  createdAt: '2024-03-15T10:00:00.000Z',
}

export const Normal: Story = {
  args: {
    patient: pacienteBase,
    isFavorite: false,
    isNew: false,
    viewMode: 'grid',
    onToggleFavorite: () => {},
    onEdit: () => {},
    onDelete: () => {},
  },
}

export const Favorito: Story = {
  args: {
    patient: pacienteBase,
    isFavorite: true,
    isNew: false,
    viewMode: 'grid',
    onToggleFavorite: () => {},
    onEdit: () => {},
    onDelete: () => {},
  },
}

export const Nuevo: Story = {
  args: {
    patient: { ...pacienteBase, id: '2', name: 'Carlos Pérez' },
    isFavorite: false,
    isNew: true,
    viewMode: 'grid',
    onToggleFavorite: () => {},
    onEdit: () => {},
    onDelete: () => {},
  },
}

export const VistaLista: Story = {
  args: {
    patient: pacienteBase,
    isFavorite: false,
    isNew: false,
    viewMode: 'list',
    onToggleFavorite: () => {},
    onEdit: () => {},
    onDelete: () => {},
  },
}

export const SinAvatar: Story = {
  args: {
    patient: { ...pacienteBase, avatar: '' },
    isFavorite: false,
    isNew: false,
    viewMode: 'grid',
    onToggleFavorite: () => {},
    onEdit: () => {},
    onDelete: () => {},
  },
}