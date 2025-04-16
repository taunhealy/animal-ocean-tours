import { notFound } from "next/navigation";
import Image from "next/image";
import { formatCurrency, formatDate } from "@/lib/utils";
import TourDetailHeader from "@/app/components/tours/TourDetailHeader";
import TourHighlights from "@/app/components/tours/TourHighlights";
import TourItinerary from "@/app/components/tours/TourItinerary";
import BookingForm from "@/app/components/tours/BookingForm";
import { fallbackTours } from "@/lib/data/tours";

// Add PayPal checkout component import
import PayPalCheckout from "@/app/components/checkout/PayPalCheckout";

interface TourPageProps {
  params: { slug: string };
}

// Add this function to fetch tour data
async function getTourById(slug: string) {
  try {
    // First try to fetch from API
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${origin}/api/tours/${slug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (response.ok) {
      return response.json();
    }

    // If API fails, fall back to static data
    const fallbackTour = fallbackTours.find((tour) => tour.id === slug);
    if (fallbackTour) {
      return fallbackTour;
    }

    return null;
  } catch (error) {
    // If fetch fails, try fallback data
    const fallbackTour = fallbackTours.find((tour) => tour.id === slug);
    return fallbackTour || null;
  }
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

  // Use the slug from params directly
  const slug = params.slug;
  const tour = await getTourById(slug);

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

  // Get location strings based on the schema structure
  const startLocationName = tour.startLocation?.name || "";
  const endLocationName = tour.endLocation?.name || "";
  const locationString =
    startLocationName === endLocationName
      ? startLocationName
      : `${startLocationName} to ${endLocationName}`;

  return (
    <main className="container mx-auto px-4 py-8 font-primary">
      <TourDetailHeader
        title={tour.name}
        location={locationString}
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
                <h3 className="text-lg font-medium">Location</h3>
                <p>{tour.location}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Max Participants</h3>
                <p>{tour.maxParticipants} people</p>
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
          {tour.itinerary && tour.itinerary.length > 0 && (
            <TourItinerary itinerary={tour.itinerary} />
          )}

          {/* Equipment Section */}
          {tour.equipment && tour.equipment.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Available Equipment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tour.equipment.map((item: any) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <h3 className="font-medium">
                      {item.equipment?.name || "Equipment"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.equipment?.description || ""}
                    </p>
                    {item.additionalFee && (
                      <p className="text-sm font-medium mt-2">
                        Additional Fee: {formatCurrency(item.additionalFee)}
                      </p>
                    )}
                    <p className="text-sm mt-1">
                      {item.included
                        ? "Included in tour price"
                        : "Available for rent"}
                    </p>
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
                checkoutComponent={PayPalCheckout}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
