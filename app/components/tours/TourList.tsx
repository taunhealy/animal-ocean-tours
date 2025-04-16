"use client";

import { Tour } from "@/lib/types/tour";

interface TourListProps {
  tours: Tour[] | undefined;
  onEdit: (tour: Tour) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function TourList({
  tours,
  onEdit,
  onDelete,
  isDeleting,
}: TourListProps) {
  if (!tours || tours.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-500 font-primary">
          No tours found. Create your first tour!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
                <span className="text-sm text-gray-500 font-primary">
                  {tour.duration} days • {tour.distance} km
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
                onClick={() => onEdit(tour)}
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
                From {tour.startLocation} to {tour.endLocation}
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
