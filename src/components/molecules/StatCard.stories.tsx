import type { Meta, StoryObj } from '@storybook/react'
import { StatCard } from './StatCard'

const meta: Meta<typeof StatCard> = {
  title: 'Molecules/StatCard',
  component: StatCard,
}
export default meta

type Story = StoryObj<typeof StatCard>

export const TotalPacientes: Story = {
  args: {
    label: 'Total pacientes',
    value: 42,
    icon: '👥',
    color: '#4c6f87',
    clickable: false,
  },
}

export const Favoritos: Story = {
  args: {
    label: 'Favoritos',
    value: 8,
    icon: '⭐',
    color: '#f59e0b',
    clickable: false,
  },
}

export const AgregadosHoy: Story = {
  args: {
    label: 'Agregados hoy',
    value: 3,
    icon: '✚',
    color: '#6aa6aa',
    clickable: true,
    active: false,
    onClick: () => alert('Toggle'),
  },
}

export const AgregadosHoyActivo: Story = {
  args: {
    label: 'Agregados hoy',
    value: 3,
    icon: '✚',
    color: '#6aa6aa',
    clickable: true,
    active: true,
    onClick: () => alert('Toggle'),
  },
}