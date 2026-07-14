import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const ConImagen: Story = {
  args: {
    avatar: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/440.jpg',
    name: 'Hazel Nicolas',
    id: '43',
    size: 'md',
  },
}

export const SinImagen: Story = {
  args: {
    avatar: '',
    name: 'Juan Pérez',
    id: '10',
    size: 'md',
  },
}

export const AvatarInvalido: Story = {
  args: {
    avatar: {},
    name: 'María García',
    id: '5',
    size: 'md',
  },
}

export const Pequeño: Story = {
  args: {
    avatar: '',
    name: 'Carlos López',
    id: '7',
    size: 'sm',
  },
}

export const Grande: Story = {
  args: {
    avatar: '',
    name: 'Ana Martínez',
    id: '3',
    size: 'lg',
  },
}