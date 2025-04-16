import { prisma } from "@/lib/prisma";
import TourManagement from "@/app/components/tours/TourManagement";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Suspense } from "react";

export const metadata = {
  title: "Tour Management | Dashboard",
  description: "Manage motorcycle tours",
};

async function getTours() {
  try {
    return await prisma.tour.findMany({
      include: {
        schedules: true,
        motorcycles: {
          include: {
            motorcycle: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching tours:", error);
    return []; // Return empty array as fallback
  }
}

export default async function ToursPage() {
  const initialTours = await getTours();
  const hasTours = initialTours.length > 0;

  return (
    <div className="container mx-auto py-8 font-primary">
      <h1 className="text-3xl font-bold mb-6">Tours</h1>
      <Suspense fallback={<div>Loading tours...</div>}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-h1">Tour Management</h1>
          <Link href="/dashboard/tours/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New Tour
            </Button>
          </Link>
        </div>

        {hasTours ? (
          <TourManagement initialTours={initialTours} />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-h3 mb-4 text-gray-800">No tours found</h2>
            <p className="text-gray-600 mb-6">
              Create your first tour to get started with tour management.
            </p>
            <Link href="/dashboard/tours/new">
              <Button size="lg" className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Create Your First Tour
              </Button>
            </Link>
          </div>
        )}
      </Suspense>
    </div>
  );
}
