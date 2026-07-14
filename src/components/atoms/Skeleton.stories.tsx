import type { Meta, StoryObj } from '@storybook/react-vite'
import { PatientCardSkeleton } from './Skeleton'

const meta = {
  title: 'Atoms/Skeleton',
  component: PatientCardSkeleton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PatientCardSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Multiple: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <PatientCardSkeleton />
      <PatientCardSkeleton />
      <PatientCardSkeleton />
    </div>
  ),
}