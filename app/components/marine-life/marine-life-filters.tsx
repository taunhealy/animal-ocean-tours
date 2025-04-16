"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface FilterOptions {
  animalTypes: string[];
  seasons: string[];
  tourTypes: string[];
}

interface CurrentFilters {
  animalType?: string;
  season?: string;
  tourType?: string;
}

export default function MarineLifeFilters({
  options,
  currentFilters,
}: {
  options: FilterOptions;
  currentFilters: CurrentFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = (
    key: keyof CurrentFilters,
    value: string | undefined
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="font-primary text-xl font-semibold mb-4">Filters</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="font-primary text-sm font-medium">
            Animal Type
          </label>
          <Select
            value={currentFilters.animalType || undefined}
            onValueChange={(value) => updateFilter("animalType", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All animal types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All animal types</SelectItem>
              {options.animalTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="font-primary text-sm font-medium">Season</label>
          <Select
            value={currentFilters.season || undefined}
            onValueChange={(value) => updateFilter("season", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All seasons" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All seasons</SelectItem>
              {options.seasons.map((season) => (
                <SelectItem key={season} value={season.toLowerCase()}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="font-primary text-sm font-medium">
            Expedition Type
          </label>
          <Select
            value={currentFilters.tourType || undefined}
            onValueChange={(value) => updateFilter("tourType", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All expeditions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All expeditions</SelectItem>
              {options.tourTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
