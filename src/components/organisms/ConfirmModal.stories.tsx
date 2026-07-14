import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConfirmModal } from './ConfirmModal'
import { fn } from 'storybook/test'

const meta = {
  title: 'Organisms/ConfirmModal',
  component: ConfirmModal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    patientName: 'Hazel Nicolas',
    onConfirm: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof ConfirmModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NombreLargo: Story = {
  args: {
    patientName: 'María Antonieta de los Remedios García López',
  },
}