"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TourList from "./TourList";
import { Tour } from "@/lib/types/tour";
import Link from "next/link";

// API functions for CRUD operations
const fetchTours = async () => {
  const res = await fetch("/api/tours");
  if (!res.ok) throw new Error("Failed to fetch tours");
  return res.json();
};

const createTour = async (tourData: Omit<Tour, "id">) => {
  const res = await fetch("/api/tours", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tourData),
  });
  if (!res.ok) throw new Error("Failed to create tour");
  return res.json();
};

const updateTour = async ({ id, ...tourData }: Tour) => {
  const res = await fetch(`/api/tours/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tourData),
  });
  if (!res.ok) throw new Error("Failed to update tour");
  return res.json();
};

const deleteTour = async (id: string) => {
  const res = await fetch(`/api/tours/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete tour");
  return res.json();
};

interface TourManagementProps {
  initialTours: Tour[];
}

export default function TourManagement({ initialTours }: TourManagementProps) {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const queryClient = useQueryClient();

  // Initialize query client with initial data from server component
  const { data: tours } = useQuery({
    queryKey: ["tours"],
    queryFn: fetchTours,
    initialData: initialTours,
  });

  // Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: createTour,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      setSelectedTour(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTour,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      setSelectedTour(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTour,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
    },
  });

  const handleSubmit = (tourData: Omit<Tour, "id">) => {
    if (selectedTour) {
      updateMutation.mutate({ id: selectedTour.id, ...tourData });
    } else {
      createMutation.mutate(tourData);
    }
  };

  const handleEdit = (tour: Tour) => {
    setSelectedTour(tour);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this tour?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setSelectedTour(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-h2">Tours</h2>
          <Link
            href="/dashboard/tours/new"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Add New Tour
          </Link>
        </div>
        <TourList
          tours={tours}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      </div>
      <div className="lg:col-span-1">
        <div className="card p-6">
          <h2 className="text-h3 mb-4">
            {selectedTour ? "Edit Tour" : "Add New Tour"}
          </h2>
        </div>
      </div>
    </div>
  );
}
