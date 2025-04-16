import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  BanknoteIcon,
} from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { PageHeader } from "@/app/components/ui/page-header";
import { Separator } from "@/app/components/ui/separator";
import { BookingStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Booking Details | Off The Grid",
  description: "View details of your motorcycle tour booking",
};

async function getBooking(id: string, userId: string) {
  const booking = await prisma.booking.findUnique({
    where: {
      id,
      userId, // Ensure the booking belongs to the current user
    },
    include: {
      tourSchedule: {
        include: {
          tour: {
            include: {
              itinerary: {
                orderBy: {
                  dayNumber: "asc",
                },
              },
              guide: true,
            },
          },
        },
      },
      motorcycles: {
        include: {
          motorcycle: true,
        },
      },
      equipmentRentals: true,
      payments: true,
    },
  });

  return booking;
}

function getStatusColor(status: BookingStatus) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
    case "REFUNDED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusLabel(status: BookingStatus) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "CONFIRMED":
      return "Confirmed";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    case "REFUNDED":
      return "Refunded";
    default:
      return status;
  }
}

export default async function BookingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin?callbackUrl=/dashboard/customer/bookings");
  }

  const booking = await getBooking(params.id, session.user.id);

  if (!booking) {
    notFound();
  }

  const tour = booking.tourSchedule.tour;
  const isPastBooking = new Date(booking.tourSchedule.endDate) < new Date();
  const canCancel = booking.status === "CONFIRMED" && !isPastBooking;

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Booking Details"
          description={`Booking reference: ${booking.id.substring(0, 8).toUpperCase()}`}
        />
        <Badge className={getStatusColor(booking.status)}>
          {getStatusLabel(booking.status)}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Tour Overview */}
          <Card>
            <div className="relative h-48 w-full">
              <img
                src={tour.images[0] || "/images/placeholder.jpg"}
                alt={tour.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">{tour.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                {tour.startLocation}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Dates</p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(booking.tourSchedule.startDate),
                        "MMM d, yyyy"
                      )}{" "}
                      -{" "}
                      {format(
                        new Date(booking.tourSchedule.endDate),
                        "MMM d, yyyy"
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Participants</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.participants} people
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {tour.duration} days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BanknoteIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Total Price</p>
                    <p className="text-sm text-muted-foreground">
                      ${Number(booking.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {canCancel && (
                <Button variant="destructive" className="w-full mt-4">
                  Cancel Booking
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle>Tour Itinerary</CardTitle>
              <CardDescription>
                Day-by-day schedule of your tour
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tour.itinerary.map((day) => (
                <div key={day.id} className="space-y-2">
                  <h3 className="font-medium">{day.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {day.description}
                  </p>
                  {day.distance && (
                    <p className="text-sm">Distance: {day.distance} km</p>
                  )}
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Tour Price</span>
                  <span className="text-sm font-medium">
                    ${Number(booking.totalAmount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Paid Amount</span>
                  <span className="text-sm font-medium">
                    ${Number(booking.paidAmount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Balance Due</span>
                  <span className="text-sm font-medium">
                    $
                    {(
                      Number(booking.totalAmount) - Number(booking.paidAmount)
                    ).toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">
                    ${Number(booking.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              {booking.status === "CONFIRMED" &&
                Number(booking.paidAmount) < Number(booking.totalAmount) && (
                  <Button className="w-full">Pay Balance</Button>
                )}
            </CardContent>
          </Card>

          {/* Motorcycles */}
          <Card>
            <CardHeader>
              <CardTitle>Your Motorcycles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.motorcycles.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-md overflow-hidden">
                    <img
                      src={
                        item.motorcycle.imageUrl ||
                        "/images/motorcycle-placeholder.jpg"
                      }
                      alt={`${item.motorcycle.make} ${item.motorcycle.model}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {item.motorcycle.make} {item.motorcycle.model}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.motorcycle.engineSize}cc • {item.motorcycle.year}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Equipment Rentals */}
          {booking.equipmentRentals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Equipment Rentals</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {booking.equipmentRentals.map((rental) => (
                    <li key={rental.id} className="flex justify-between">
                      <span className="text-sm">
                        {rental.equipmentType} x{rental.quantity}
                      </span>
                      <span className="text-sm font-medium">
                        ${Number(rental.pricePerDay).toFixed(2)}/day
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Guide Information */}
          {tour.guide && (
            <Card>
              <CardHeader>
                <CardTitle>Your Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img
                      src={
                        tour.guide.profileImage ||
                        "/images/avatar-placeholder.jpg"
                      }
                      alt={tour.guide.name || "Tour Guide"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{tour.guide.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tour.guide.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
