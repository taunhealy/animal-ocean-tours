import { notFound } from "next/navigation";
import Image from "next/image";
import { formatCurrency, formatDate } from "@/lib/utils";
import TourDetailHeader from "@/app/components/tours/TourDetailHeader";
import TourHighlights from "@/app/components/tours/TourHighlights";
import TourItinerary from "@/app/components/tours/TourItinerary";
import BookingForm from "@/app/components/tours/BookingForm";

interface TourPageProps {
  params: Promise<{ id: string }>;
}

// Add this function to fetch tour data
async function getTourById(id: string) {
  // Use absolute URL with origin for server component
  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const response = await fetch(`${origin}/api/tours/${id}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function TourPage({ params }: TourPageProps) {
  // Create a placeholder for empty schedules
  const placeholderSchedule = {
    id: "placeholder",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    price: 0,
    availableSpots: 5,
    status: "OPEN",
  };

  // Properly await the params in Next.js 15
  const { id } = await params;
  const tour = await getTourById(id);

  if (!tour) {
    notFound();
  }

  // Ensure tour.schedules exists and has at least one item for development
  const schedules =
    tour.schedules && tour.schedules.length > 0
      ? tour.schedules
      : process.env.NODE_ENV === "development"
        ? [placeholderSchedule]
        : [];

  return (
    <main className="container mx-auto px-4 py-8 font-primary">
      <TourDetailHeader
        title={tour.name}
        location={`${tour.startLocation} to ${tour.endLocation}`}
        rating={tour.averageRating || 0}
        reviewCount={tour.reviewCount || 0}
        difficulty={tour.difficulty}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          {/* Tour Image */}
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
            <Image
              src={tour.images?.[0] || "/images/placeholder.jpg"}
              alt={tour.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Tour Description */}
          <div className="prose max-w-none mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              About This Tour
            </h2>
            <p className="text-gray-700">{tour.description}</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <h3 className="text-lg font-medium">Duration</h3>
                <p>{tour.duration} days</p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Distance</h3>
                <p>{tour.distance} kilometers</p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Max Participants</h3>
                <p>{tour.maxParticipants} riders</p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Difficulty</h3>
                <p>{tour.difficulty}</p>
              </div>
            </div>
          </div>

          {/* Tour Highlights */}
          {tour.highlights && tour.highlights.length > 0 && (
            <TourHighlights highlights={tour.highlights} />
          )}

          {/* Tour Inclusions/Exclusions */}
          {(tour.inclusions?.length > 0 || tour.exclusions?.length > 0) && (
            <div className="mb-8">
              {tour.inclusions?.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    What's Included
                  </h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {tour.inclusions.map((item: string, index: number) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {tour.exclusions?.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">
                    What's Not Included
                  </h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {tour.exclusions.map((item: string, index: number) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {/* Tour Itinerary */}
          {tour.itinerary && <TourItinerary itinerary={tour.itinerary} />}

          {/* Available Motorcycles */}
          {tour.motorcycles && tour.motorcycles.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Available Motorcycles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tour.motorcycles.map((tourMotorcycle: any) => (
                  <div
                    key={tourMotorcycle.id}
                    className="border rounded-lg p-4"
                  >
                    <h3 className="font-medium">
                      {tourMotorcycle.motorcycle.make}{" "}
                      {tourMotorcycle.motorcycle.model}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tourMotorcycle.motorcycle.engineSize}cc •{" "}
                      {tourMotorcycle.motorcycle.type}
                    </p>
                    {tourMotorcycle.surcharge && (
                      <p className="text-sm font-medium mt-2">
                        Surcharge: {formatCurrency(tourMotorcycle.surcharge)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {/* Booking Form */}
          <div className="sticky top-24">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(tour.basePrice)}
                </span>
                <span className="text-gray-500">per person</span>
              </div>

              <BookingForm
                tourId={tour.id}
                schedules={schedules}
                basePrice={tour.basePrice}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
