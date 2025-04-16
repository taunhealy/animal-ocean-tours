import { prisma } from "@/app/lib/prisma";
import TourForm from "@/app/components/tours/TourForm";

export const metadata = {
  title: "Add New Tour | Dashboard",
  description: "Create a new motorcycle tour",
};

async function getMotorcycles() {
  try {
    return await prisma.motorcycle.findMany({
      orderBy: {
        model: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching motorcycles:", error);
    return []; // Return empty array as fallback
  }
}

export default async function NewTourPage() {
  const motorcycles = await getMotorcycles();

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8 max-w-5xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8 font-primary">
        Add New Tour
      </h1>
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <TourForm />
      </div>
    </div>
  );
}
