import { Suspense } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingsList } from "@/app/components/bookings/BookingsList";
import { BookingsListSkeleton } from "@/app/components/bookings/BookingsListSkeleton";
import { PageHeader } from "@/app/components/ui/page-header";
import { redirect } from "next/navigation";
import { BookingStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "My Bookings | Off The Grid",
  description: "View and manage your motorcycle tour bookings",
};

async function getBookings(userId: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        tourSchedule: {
          include: {
            tour: {
              select: {
                name: true,
                startLocation: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        bookingDate: "desc",
      },
    });

    return bookings.map((booking) => ({
      id: booking.id,
      propertyName: booking.tourSchedule.tour.name,
      location: booking.tourSchedule.tour.startLocation,
      checkIn: booking.tourSchedule.startDate,
      checkOut: booking.tourSchedule.endDate,
      status: mapBookingStatus(booking.status),
      totalPrice: Number(booking.totalAmount),
      imageUrl:
        booking.tourSchedule.tour.images[0] || "/images/placeholder.jpg",
    }));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

// Map Prisma BookingStatus to the format expected by the BookingsList component
function mapBookingStatus(
  status: BookingStatus
): "upcoming" | "completed" | "cancelled" {
  switch (status) {
    case "PENDING":
    case "CONFIRMED":
      return "upcoming";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
    case "REFUNDED":
      return "cancelled";
    default:
      return "upcoming";
  }
}

export default async function CustomerBookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin?callbackUrl=/dashboard/customer/bookings");
  }

  const bookings = await getBookings(session.user.id);

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="My Bookings"
        description="View and manage your motorcycle tour bookings"
      />

      <Suspense fallback={<BookingsListSkeleton />}>
        <BookingsList initialBookings={bookings} />
      </Suspense>
    </div>
  );
}
