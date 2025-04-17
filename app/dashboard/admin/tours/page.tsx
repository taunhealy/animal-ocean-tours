import TourList from "@/app/components/tours/TourList";
import { prisma } from "@/lib/prisma";

export default async function ToursManagementPage() {
  const tours = await prisma.tour.findMany({
    select: {
      id: true,
      name: true,
      difficulty: true,
      duration: true,
      conservationInfo: true,
      seasons: true,
      departurePort: true,
      marineArea: true,
      expeditionType: true,
      maxParticipants: true,
      basePrice: true,
      safetyBriefing: true,
      images: true,
      highlights: true,
      inclusions: true,
      exclusions: true,
      categoryId: true,
      guideId: true,
      createdAt: true,
      updatedAt: true,
      startLocation: { select: { name: true } },
      endLocation: { select: { name: true } },
      schedules: { select: { id: true } },
      equipment: {
        select: { equipment: { select: { id: true, name: true } } },
      },
      tideDependency: true,
    },
    include: {
      equipment: {
        select: { equipment: { select: { id: true, name: true } } },
      },
    },
  });

  const transformedTours = tours.map((tour) => ({
    ...tour,
    requiredEquipment: tour.equipment?.map((e) => e.equipment.name) || [],
  })) as Tour[];

  return (
    <div className="space-y-6">
      <h2 className="text-h3 font-primary">Tours Management</h2>

      <div className="bg-card rounded-lg p-4 shadow-sm">
        <TourList tours={transformedTours} />
      </div>
    </div>
  );
}
