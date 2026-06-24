import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DateFilter } from './DateFilter'

const meta: Meta<typeof DateFilter> = {
  title: 'Molecules/DateFilter',
  component: DateFilter,
}
export default meta

type Story = StoryObj<typeof DateFilter>

const mockPatients = [
  { createdAt: '2024-03-15T10:00:00.000Z' },
  { createdAt: '2023-06-20T10:00:00.000Z' },
  { createdAt: '2025-01-10T10:00:00.000Z' },
]

export const TodosLosAnios: Story = {
  render: () => {
    const [filter, setFilter] = useState('all')
    return <DateFilter dateFilter={filter} onDateFilterChange={setFilter} patients={mockPatients} />
  },
}

export const AnioSeleccionado: Story = {
  render: () => {
    const [filter, setFilter] = useState('2024')
    return <DateFilter dateFilter={filter} onDateFilterChange={setFilter} patients={mockPatients} />
  },
}