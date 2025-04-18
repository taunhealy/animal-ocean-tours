"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface CreateLocationProps {
  onSuccess: (location: { id: string; name: string }) => void;
}

interface LocationInput {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export function CreateLocation({ onSuccess }: CreateLocationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState<LocationInput>({
    name: "",
    address: "",
    city: "",
    country: "",
    latitude: 0,
    longitude: 0,
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LocationInput) => {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create location");
      return response.json();
    },
    onSuccess: (newLocation) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location created successfully");
      onSuccess(newLocation);
      setIsOpen(false);
      setLocation({
        name: "",
        address: "",
        city: "",
        country: "",
        latitude: 0,
        longitude: 0,
      });
    },
    onError: () => {
      toast.error("Failed to create location");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={location.name}
              onChange={(e) =>
                setLocation({ ...location, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <Input
              value={location.address}
              onChange={(e) =>
                setLocation({ ...location, address: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">City</label>
            <Input
              value={location.city}
              onChange={(e) =>
                setLocation({ ...location, city: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Country</label>
            <Input
              value={location.country}
              onChange={(e) =>
                setLocation({ ...location, country: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Latitude</label>
              <Input
                type="number"
                step="any"
                value={location.latitude}
                onChange={(e) =>
                  setLocation({
                    ...location,
                    latitude: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Longitude</label>
              <Input
                type="number"
                step="any"
                value={location.longitude}
                onChange={(e) =>
                  setLocation({
                    ...location,
                    longitude: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <Button
            className="w-full"
            disabled={isPending}
            onClick={() => mutate(location)}
          >
            Create Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
