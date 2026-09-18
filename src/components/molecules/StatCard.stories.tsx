import type { Meta, StoryObj } from '@storybook/react'
import { StatCard } from './StatCard'

const meta: Meta<typeof StatCard> = {
  title: 'Molecules/StatCard',
  component: StatCard,
}
export default meta

type Story = StoryObj<typeof StatCard>

export const Total: Story = {
  args: {
    label: 'Total',
    value: 42,
    active: true,
    onClick: () => alert('Ver todos'),
  },
}

export const Favoritos: Story = {
  args: {
    label: 'Favoritos',
    value: 8,
    active: false,
    onClick: () => alert('Ver favoritos'),
  },
}
