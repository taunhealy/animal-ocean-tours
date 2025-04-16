import { Suspense } from "react";
import TourGrid from "@/app/components/tours/tour-grid";
import TourFilters from "@/app/components/tours/tour-filters";
import TourGridSkeleton from "@/app/components/tours/tour-grid-skeleton";

export const metadata = {
  title: "Ocean Tours | Animal Ocean",
  description:
    "Explore our exciting ocean adventures including Seal Kayaking, Ocean Safari, and Sardine Run tours.",
};

export default function ToursPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Access search params directly with default empty strings to prevent null/undefined
  const month = (searchParams.month as string) || "";
  const tourType = (searchParams.tourType as string) || "";
  const difficulty = (searchParams.difficulty as string) || "";
  const duration = (searchParams.duration as string) || "";
  const search = (searchParams.search as string) || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Ocean Adventures</h1>

      <div className="mb-6">
        <p className="text-lg text-gray-700">
          Discover our range of unforgettable ocean experiences, from peaceful
          Seal Kayaking tours to thrilling Ocean Safaris and the spectacular
          Sardine Run.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="w-full md:w-1/4">
          <TourFilters
            initialMonth={month}
            initialTourType={tourType}
            initialDifficulty={difficulty}
            initialDuration={duration}
            initialSearch={search}
          />
        </div>

        {/* Tour Grid */}
        <div className="w-full md:w-3/4">
          <Suspense fallback={<TourGridSkeleton />}>
            <TourGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
