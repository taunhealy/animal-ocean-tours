import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  Users,
  Clock,
  Banknote,
  ShieldCheck,
  Compass,
} from "lucide-react";
import Image from "next/image";

export default async function TourPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    return notFound();
  }

  const tour = await prisma.tour.findUnique({
    where: { id: params.id },
    include: {
      tourType: true,
      marineLife: true,
      startLocation: true,
      endLocation: true,
      category: true,
      guide: true,
      equipment: {
        include: {
          equipment: true,
        },
      },
      schedules: true,
    },
  });

  if (!tour) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[400px] w-full">
        <Image
          src={tour.images[0] || "/images/placeholder-tour.jpg"}
          alt={tour.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="capitalize">
                  {tour.difficulty.toLowerCase()}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  {tour.tourType.name}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold mb-4 font-primary">
                {tour.name}
              </h1>
              <p className="text-gray-600 mb-6 font-primary">
                {tour.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-primary">{tour.duration} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-primary">
                    Max {tour.maxParticipants} people
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-blue-600" />
                  <span className="font-primary">
                    ${tour.basePrice.toString()}
                  </span>
                </div>
              </div>

              <Link href={`/tours/${tour.id}/book`}>
                <Button size="lg" className="w-full md:w-auto font-primary">
                  Book Now
                </Button>
              </Link>
            </div>

            <div className="lg:w-1/3 bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4 font-primary">Tour Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-primary">
                      Start Location
                    </p>
                    <p className="font-medium font-primary">
                      {tour.startLocation?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-primary">
                      Next Available
                    </p>
                    <p className="font-medium font-primary">
                      {tour.schedules[0]?.startDate
                        ? new Date(
                            tour.schedules[0].startDate
                          ).toLocaleDateString()
                        : "Contact for dates"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-semibold mb-2">Marine Life</h3>
            <div className="flex flex-wrap gap-2">
              {tour.marineLife.map((species) => (
                <span
                  key={species.id}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {species.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Equipment</h3>
            <ul className="list-disc list-inside">
              {tour.equipment.map((item) => (
                <li key={item.equipment.id}>{item.equipment.name}</li>
              ))}
            </ul>
          </div>

          {tour.conservationInfo && (
            <div>
              <h3 className="font-semibold mb-2">Conservation Information</h3>
              <p className="text-gray-600">{tour.conservationInfo}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Safety Briefing</h3>
            <p className="text-gray-600">{tour.safetyBriefing}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Highlights</h3>
            <ul className="list-disc list-inside">
              {tour.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Inclusions</h3>
            <ul className="list-disc list-inside">
              {tour.inclusions.map((inclusion, index) => (
                <li key={index}>{inclusion}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Exclusions</h3>
            <ul className="list-disc list-inside">
              {tour.exclusions.map((exclusion, index) => (
                <li key={index}>{exclusion}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
