interface ProgressBarProps {
  loading: boolean
}

export function ProgressBar({ loading }: ProgressBarProps) {
  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 progress-track">
      <div className="h-full progress-bar-fill" />
    </div>
  )
}