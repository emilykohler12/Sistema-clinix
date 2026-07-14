import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatsBar } from './StatsBar'
import { fn } from 'storybook/test'

const meta = {
  title: 'Organisms/StatsBar',
  component: StatsBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    total: 98,
    favorites: 3,
    addedThisSession: 0,
    showingNewOnly: false,
    onToggleNewOnly: fn(),
  },
} satisfies Meta<typeof StatsBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ConAgregados: Story = {
  args: { addedThisSession: 5 },
}

export const FiltrandoNuevos: Story = {
  args: { addedThisSession: 5, showingNewOnly: true },
}

export const SinFavoritos: Story = {
  args: { favorites: 0 },
}