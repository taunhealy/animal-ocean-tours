import { prisma } from "@/lib/prisma";
import TourForm from "@/app/components/tours/TourForm";

export default async function EditTourPage({
  params,
}: {
  params: { id: string };
}) {
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
    return <div>Tour not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Edit Tour</h1>
      <TourForm initialData={tour} />
    </div>
  );
}
