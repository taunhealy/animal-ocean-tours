"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { CreateLocation } from "../locations/create-location";

interface LocationSelectProps {
  selected: string;
  onChange: (value: string) => void;
  locations: any[]; // or define a proper Location interface
  label?: string;
}

export function LocationSelect({
  selected,
  onChange,
  locations,
  label = "Select location",
}: LocationSelectProps) {
  const { data: locationsData = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await fetch("/api/locations");
      if (!response.ok) throw new Error("Failed to fetch locations");
      return response.json();
    },
  });

  return (
    <div className="flex gap-2 items-start">
      <Select value={selected} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {locationsData.map((location: { id: string; name: string }) => (
            <SelectItem key={location.id} value={location.id}>
              {location.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <CreateLocation onSuccess={(newLocation) => onChange(newLocation.id)} />
    </div>
  );
}
