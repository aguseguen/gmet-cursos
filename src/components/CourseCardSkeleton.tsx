export default function CourseCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-brand-plum bg-brand-surface p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 rounded bg-brand-plum" />
          <div className="h-5 w-3/4 rounded bg-brand-plum" />
        </div>
        <div className="h-6 w-20 shrink-0 rounded-full bg-brand-plum" />
      </div>

      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-brand-plum" />
        <div className="h-3 w-full rounded bg-brand-plum" />
        <div className="h-3 w-2/3 rounded bg-brand-plum" />
      </div>

      <div className="mt-4 flex gap-2">
        <div className="h-6 w-24 rounded-full bg-brand-plum" />
        <div className="h-6 w-20 rounded-full bg-brand-plum" />
      </div>

      <div className="mt-4 h-9 w-28 rounded-lg bg-brand-plum" />
    </div>
  );
}
