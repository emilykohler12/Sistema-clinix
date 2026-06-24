export function PatientCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden card">
      <div className="h-1.5 skeleton-bar-top" />
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full flex-shrink-0 skeleton-shimmer" />
          <div className="flex-1">
            <div className="h-4 rounded mb-2 w-3/4 skeleton-shimmer" />
            <div className="h-3 rounded w-1/4 skeleton-shimmer" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 rounded w-full skeleton-shimmer" />
          <div className="h-3 rounded w-5/6 skeleton-shimmer" />
        </div>
        <div className="h-8 rounded-lg mt-4 skeleton-shimmer" />
      </div>
    </div>
  )
}