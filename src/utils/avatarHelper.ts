export function getInitials(name: string): string {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('')
}

export function isValidAvatar(avatar: string | object): boolean {
  return typeof avatar === 'string' && avatar.trim() !== ''
}

export function getAvatarColor(id: string): string {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-pink-500',
  ]
  const index = parseInt(id, 10) % colors.length
  return colors[isNaN(index) ? 0 : index]
}