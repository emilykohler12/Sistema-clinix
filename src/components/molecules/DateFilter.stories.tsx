import type { Meta, StoryObj } from '@storybook/react'
import { DateFilter } from './DateFilter'

const meta: Meta<typeof DateFilter> = {
  title: 'Molecules/DateFilter',
  component: DateFilter,
}
export default meta

type Story = StoryObj<typeof DateFilter>

export const TodosLosAnios: Story = {
  args: {
    dateFilter: 'all',
    onDateFilterChange: async () => {},
  },
}

export const AnioSeleccionado: Story = {
  args: {
    dateFilter: '2024',
    onDateFilterChange: async () => {},
  },
}