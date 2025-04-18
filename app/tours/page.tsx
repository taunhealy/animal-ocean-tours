import TourGrid from "@/app/components/tours/tour-grid";
import TourFilters from "@/app/components/tours/tour-filters";
import { Input } from "@/app/components/ui/input";
import { prisma } from "@/lib/prisma";

interface ToursPageProps {
  searchParams: {
    month?: string;
    tourType?: string;
    difficulty?: string;
    duration?: string;
    search?: string;
  };
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  // Get total number of published tours
  const tourCount = await prisma.tour.count({
    where: { published: true },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Ocean Tours</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <TourFilters
            initialMonth={searchParams.month}
            initialTourType={searchParams.tourType}
            initialDifficulty={searchParams.difficulty}
            initialDuration={searchParams.duration}
            initialSearch={searchParams.search}
          />
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Search Bar - only show if more than 9 tours */}
          {tourCount > 9 && (
            <div className="mb-6">
              <form className="flex gap-4">
                <Input
                  type="search"
                  placeholder="Search tours..."
                  name="search"
                  defaultValue={searchParams.search}
                  className="max-w-md"
                />
              </form>
            </div>
          )}

          {/* Tour Grid */}
          <TourGrid searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}
