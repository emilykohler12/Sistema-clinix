import { useState } from 'react'
import { getInitials, isValidAvatar, getAvatarColor } from '../../utils/avatarHelper'

interface AvatarProps {
  avatar: string | object
  name: string
  id: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
}

export function Avatar({ avatar, name, id, size = 'md' }: AvatarProps) {
  const [imgError, setImgError] = useState(false)
  const sizeClass = sizeClasses[size]
  const colorClass = getAvatarColor(id)

  if (isValidAvatar(avatar) && !imgError) {
    return (
      <img
        src={avatar as string}
        alt={name}
        onError={() => setImgError(true)}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
      />
    )
  }

  return (
    <div className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-medium">{getInitials(name)}</span>
    </div>
  )
}