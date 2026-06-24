import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DateFilter } from './DateFilter'

const meta: Meta<typeof DateFilter> = {
  title: 'Molecules/DateFilter',
  component: DateFilter,
}
export default meta

type Story = StoryObj<typeof DateFilter>

export const TodosLosAnios: Story = {
  render: () => {
    const [filter, setFilter] = useState('all')
    return <DateFilter dateFilter={filter} onDateFilterChange={setFilter} />
  },
}

export const AnioSeleccionado: Story = {
  render: () => {
    const [filter, setFilter] = useState('2024')
    return <DateFilter dateFilter={filter} onDateFilterChange={setFilter} />
  },
}