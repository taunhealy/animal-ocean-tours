import { Skeleton } from "@/app/components/ui/skeleton";

export default function MotorcycleGridSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
