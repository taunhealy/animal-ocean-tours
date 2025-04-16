import { Skeleton } from "./skeleton";

interface GridSkeletonProps {
  columns: number;
  items: number;
}

export function GridSkeleton({ columns, items }: GridSkeletonProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}
    >
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-md" />
          <Skeleton className="h-6 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
