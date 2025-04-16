import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CustomerProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch bookings directly on the server
  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      tourSchedule: {
        include: {
          tour: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const upcomingBookings = bookings.filter(
    (booking) => new Date(booking.tourSchedule.startDate) >= new Date()
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED"
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <h2 className="text-h4 mb-6 font-primary">Your Profile</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-h5 mb-2 font-primary">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 font-primary">Name</p>
              <p className="font-primary">
                {session.user.name || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-primary">Email</p>
              <p className="font-primary">
                {session.user.email || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-primary">Role</p>
              <p className="font-primary capitalize">
                {session.user.role?.toLowerCase() || "Customer"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-h5 mb-2 font-primary">Account Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 font-primary">
                Total Bookings
              </p>
              <p className="text-h4 font-primary">{bookings.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-primary">
                Upcoming Tours
              </p>
              <p className="text-h4 font-primary">{upcomingBookings.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-primary">
                Completed Tours
              </p>
              <p className="text-h4 font-primary">{completedBookings.length}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/profile/edit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-primary"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
