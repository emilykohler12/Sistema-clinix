import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressBar } from './ProgressBar'

const meta = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Cargando: Story = {
  args: { loading: true },
}

export const Oculto: Story = {
  args: { loading: false },
}