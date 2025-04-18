"use client";

import { TourWithRelations } from "@/lib/types/tour";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";

interface TourListProps {
  tours: TourWithRelations[] | undefined;
  editPath?: string;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  createPath?: string;
  onEdit?: (tour: TourWithRelations) => void;
}

export default function TourList({
  tours,
  editPath = "/dashboard/admin/tours/edit/[tourId]",
  onDelete = () => {},
  isDeleting = false,
  createPath = "/dashboard/admin/tours/new",
  onEdit = () => {},
}: TourListProps) {
  const router = useRouter();

  const handleEdit = (tourId: string) => {
    const path = editPath.replace("[tourId]", tourId);
    router.push(path);
  };

  const handleCreateNew = () => {
    router.push(createPath);
  };

  if (!tours || tours.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-500 font-primary">
          No tours found. Create your first tour!
        </p>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-h4 font-primary">All Tours</h3>
          <Button
            onClick={handleCreateNew}
            variant="default"
            className="bg-primary hover:bg-primary-dark text-black"
          >
            Create New Tour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-h4 font-primary">All Tours</h3>
        <Button
          onClick={handleCreateNew}
          variant="default"
          className="bg-primary hover:bg-primary-dark text-black"
        >
          Create New Tour
        </Button>
      </div>

      {tours.map((tour) => (
        <div key={tour.id} className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-h4 mb-1">{tour.name}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span
                  className={`badge ${
                    tour.difficulty === "EASY"
                      ? "badge-green"
                      : tour.difficulty === "MODERATE"
                        ? "badge-blue"
                        : tour.difficulty === "CHALLENGING"
                          ? "badge-amber"
                          : "badge-red"
                  }`}
                >
                  {tour.difficulty}
                </span>

                {tour.published ? (
                  <span className="badge badge-green">Published</span>
                ) : (
                  <span className="badge badge-red">Draft</span>
                )}
              </div>
              <p className="text-gray-600 line-clamp-2 font-primary">
                {tour.description}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(tour.id)}
                className="btn btn-outline py-1 px-3"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(tour.id)}
                className="btn py-1 px-3 bg-red-100 text-red-600 hover:bg-red-200"
                disabled={isDeleting}
              >
                {isDeleting ? "..." : "Delete"}
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 font-primary">
            <div className="flex justify-between">
              <span>
                From {tour.startLocation?.name} to {tour.endLocation?.name}
              </span>
              <span>${Number(tour.basePrice).toFixed(2)} per person</span>
            </div>
            <div className="mt-2">
              <span>Max participants: {tour.maxParticipants}</span>
              <span className="ml-4">
                Schedules: {tour.schedules?.length || 0}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
