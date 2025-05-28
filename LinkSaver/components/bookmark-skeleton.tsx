export default function BookmarkSkeleton() {
  return (
    <div className="h-full rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </div>
      <div className="mt-4 border-t border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="h-4 w-1/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-4 w-1/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </div>
    </div>
  )
}
