import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";

export function BookingsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-[400px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <BookingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function BookingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  );
}
