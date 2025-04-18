"use server";

import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/components/ui/card";
import { fallbackTours } from "@/lib/data/tours";

export interface TourGridProps {
  searchParams: {
    month?: string;
    tourType?: string;
    difficulty?: string;
    duration?: string;
    search?: string;
  };
}

export default async function TourGrid({ searchParams }: TourGridProps) {
  // Wrap all searchParams access in a memoized object
  const filters = {
    month: searchParams.month,
    tourType: searchParams.tourType,
    difficulty: searchParams.difficulty,
    duration: searchParams.duration,
    search: searchParams.search,
  };

  // Build filter conditions based on search params
  const where: any = {
    published: true,
  };

  // Use the filters object instead of direct searchParams access
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  // Apply difficulty filter
  if (filters.difficulty) {
    where.difficulty = filters.difficulty;
  }

  // Apply duration filter
  const duration = filters.duration;
  if (duration) {
    const [min, max] = duration.split("-").map(Number);
    where.duration = {
      gte: min || 1,
      lte: max || 999,
    };
  }

  // Apply tour type filter
  if (filters.tourType) {
    where.tourType = filters.tourType;
  }

  // Apply month filter (requires joining with TourSchedule)
  if (filters.month) {
    // Convert month name to number (1-12)
    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    const monthIndex = monthNames.indexOf(filters.month.toLowerCase());

    if (monthIndex !== -1) {
      const monthNumber = monthIndex + 1; // Convert to 1-based index
      where.schedules = {
        some: {
          startDate: {
            gte: new Date(new Date().getFullYear(), monthIndex, 1), // Use monthIndex (0-based)
            lt: new Date(new Date().getFullYear(), monthIndex + 1, 1), // Next month
          },
        },
      };
    }
  }

  // Try to fetch tours from database
  let tours = await prisma.tour
    .findMany({
      where,
      include: {
        schedules: {
          take: 1,
          orderBy: {
            startDate: "asc",
          },
          where: {
            startDate: {
              gte: new Date(),
            },
          },
        },
        startLocation: true,
        endLocation: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    .catch(() => []); // Handle database errors gracefully

  // If no tours found in database, use fallback data
  if (tours.length === 0) {
    // Apply filters to fallback data
    const filteredFallbackTours = fallbackTours.filter((tour) => {
      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !tour.name.toLowerCase().includes(searchLower) &&
          !tour.description.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Apply difficulty filter
      if (filters.difficulty && tour.difficulty !== filters.difficulty) {
        return false;
      }

      // Apply tour type filter
      if (filters.tourType && tour.tourType !== filters.tourType) {
        return false;
      }

      // Apply duration filter
      if (filters.duration) {
        const [min, max] = filters.duration.split("-").map(Number);
        if (tour.duration < min || (max && tour.duration > max)) {
          return false;
        }
      }

      // Apply month filter
      if (filters.month) {
        const monthNames = [
          "january",
          "february",
          "march",
          "april",
          "may",
          "june",
          "july",
          "august",
          "september",
          "october",
          "november",
          "december",
        ];
        const monthIndex = monthNames.indexOf(filters.month.toLowerCase());

        if (monthIndex !== -1) {
          // Check if any schedule is in the selected month
          return tour.schedules.some((schedule) => {
            const scheduleMonth = schedule.startDate.getMonth();
            return scheduleMonth === monthIndex;
          });
        }
      }

      return true;
    });

    // Transform fallback data to match Prisma Tour structure
    tours = filteredFallbackTours.map((tour) => ({
      ...tour,
      startLocation: tour.startLocation
        ? {
            id: "fallback-id",
            name: tour.startLocation.name,
            address: null,
            city: "",
            country: "",
            latitude: null,
            longitude: null,
          }
        : null,
      endLocation: tour.endLocation
        ? {
            id: "fallback-id",
            name: tour.endLocation.name,
            address: null,
            city: "",
            country: "",
            latitude: null,
            longitude: null,
          }
        : null,
    }));
  }

  if (tours.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-600">No tours found</h3>
        <p className="mt-2 text-gray-500">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <Link href={`/tours/${tour.id}`} key={tour.id}>
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={tour.images[0] || "/images/placeholder-ocean-tour.jpg"}
                  alt={tour.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute bottom-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    {tour.duration} {tour.duration === 1 ? "day" : "days"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <h3 className="font-bold text-lg mb-1">{tour.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="capitalize">
                  {typeof tour.difficulty === "string"
                    ? tour.difficulty.toLowerCase()
                    : ""}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  {tour.tourType}
                </Badge>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                {tour.startLocation?.name}
                {tour.endLocation?.name &&
                  tour.endLocation.name !== tour.startLocation?.name &&
                  ` to ${tour.endLocation.name}`}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {tour.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm">
                {tour.schedules.length > 0 ? (
                  <span>
                    Next:{" "}
                    {new Date(tour.schedules[0].startDate).toLocaleDateString()}
                  </span>
                ) : (
                  <span>No upcoming dates</span>
                )}
              </div>
              <div className="font-bold">
                ${Number(tour.basePrice).toLocaleString()}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
