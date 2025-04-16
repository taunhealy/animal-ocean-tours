import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { EmptyState } from "@/app/components/empty-state";
import { TourCard } from "@/app/components/tour-card";

export default async function MyToursPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch both tours where the guide is assigned and schedules where they're assigned
  const [assignedTours, assignedSchedules] = await Promise.all([
    db.tour.findMany({
      where: {
        guideId: session.user.id,
      },
      include: {
        schedules: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),

    db.tourSchedule.findMany({
      where: {
        guideId: session.user.id,
        // Exclude schedules from tours already assigned to this guide
        // to avoid duplicates
        tour: {
          guideId: {
            not: session.user.id,
          },
        },
      },
      include: {
        tour: true,
      },
      orderBy: {
        startDate: "asc",
      },
    }),
  ]);

  // Combine the results for display
  const toursToDisplay = [
    ...assignedTours,
    ...assignedSchedules.map((schedule) => schedule.tour),
  ];

  // Remove duplicates
  const uniqueTours = Array.from(
    new Map(toursToDisplay.map((tour) => [tour.id, tour])).values()
  );

  if (uniqueTours.length === 0) {
    return (
      <div className="container py-10">
        <EmptyState
          title="No tours assigned"
          description="You don't have any tours assigned to you yet."
          action={{
            label: "View available tours",
            href: "/dashboard/guide/available-tours",
          }}
        />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My Tours</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueTours.map((tour) => (
          <TourCard
            key={tour.id}
            tour={tour}
            href={`/dashboard/guide/my-tours/${tour.id}`}
          />
        ))}
      </div>
    </div>
  );
}
