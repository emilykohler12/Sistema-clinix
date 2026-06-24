import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
}
export default meta

type Story = StoryObj<typeof Avatar>

export const ConImagen: Story = {
  args: {
    avatar: 'https://i.pravatar.cc/150?img=1',
    name: 'María López',
    id: '1',
    size: 'md',
  },
}

export const SinImagen: Story = {
  args: {
    avatar: '',
    name: 'Carlos Pérez',
    id: '2',
    size: 'md',
  },
}

export const Grande: Story = {
  args: {
    avatar: '',
    name: 'Ana García',
    id: '3',
    size: 'lg',
  },
}