import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from './ProgressBar'

const meta: Meta<typeof ProgressBar> = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
}
export default meta

type Story = StoryObj<typeof ProgressBar>

export const Cargando: Story = {
  args: {
    loading: true,
  },
}

export const Inactivo: Story = {
  args: {
    loading: false,
  },
}