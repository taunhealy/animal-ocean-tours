"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface LocationSelectProps {
  selected: string;
  onChange: (value: string) => void;
  locations: Array<{ id: string; name: string }>;
}

export function LocationSelect({
  selected,
  onChange,
  locations,
}: LocationSelectProps) {
  return (
    <Select value={selected} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select location" />
      </SelectTrigger>
      <SelectContent>
        {locations.map((location) => (
          <SelectItem key={location.id} value={location.id}>
            {location.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
