import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardSkeleton from "@/app/components/dashboard/dashboard-skeleton";
import { Suspense } from "react";

export default function PastBookingsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <PastBookings />
    </Suspense>
  );
}

async function PastBookings() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Server-side data fetching
  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
      tourSchedule: {
        endDate: {
          lt: new Date(),
        },
      },
    },
    include: {
      tourSchedule: {
        include: {
          tour: true,
        },
      },
    },
    orderBy: {
      tourSchedule: {
        endDate: "desc",
      },
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <h2 className="text-h4 mb-4 font-primary">Past Bookings</h2>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="block p-4 rounded-lg bg-gray-50 border border-gray-200"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-h5 font-primary">
                    {booking.tourSchedule.tour.name}
                  </h3>
                  <p className="text-gray-600 font-primary">
                    {new Date(
                      booking.tourSchedule.startDate
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(
                      booking.tourSchedule.endDate
                    ).toLocaleDateString()}
                  </p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-800"
                              : booking.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                      } font-primary`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Link
                    href={`/dashboard/customer/bookings/${booking.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4 font-primary">
            You don't have any past bookings
          </p>
          <Link
            href="/tours"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-primary"
          >
            Browse Tours
          </Link>
        </div>
      )}
    </div>
  );
}
