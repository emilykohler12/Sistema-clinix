import type { Meta, StoryObj } from '@storybook/react'
import { PatientCardSkeleton } from './Skeleton'

const meta: Meta<typeof PatientCardSkeleton> = {
  title: 'Atoms/Skeleton',
  component: PatientCardSkeleton,
}
export default meta

type Story = StoryObj<typeof PatientCardSkeleton>

export const Default: Story = {}

export const Multiples: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <PatientCardSkeleton key={i} />
      ))}
    </div>
  ),
}