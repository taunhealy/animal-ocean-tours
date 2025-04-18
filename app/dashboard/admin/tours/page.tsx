import { prisma } from "@/lib/prisma";
import TourList from "@/app/components/tours/TourList";
import { TourWithRelations } from "@/lib/types/tour";

export default async function ToursManagementPage() {
  const tours = await prisma.tour.findMany({
    include: {
      startLocation: true,
      endLocation: true,
      schedules: true,
      equipment: {
        include: {
          equipment: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-h3 font-primary">Tours Management</h2>
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <TourList tours={tours as TourWithRelations[]} />
      </div>
    </div>
  );
}
