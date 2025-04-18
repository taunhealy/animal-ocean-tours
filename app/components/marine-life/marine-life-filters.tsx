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

interface CurrentFilters {
  month?: string;
  tourId?: string;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(0, i).toLocaleString("default", { month: "long" }),
}));

export default function MarineLifeFilters({
  tours,
  currentFilters,
}: {
  tours: { id: string; name: string }[];
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
          <label className="font-primary text-sm font-medium">Month</label>
          <Select
            value={currentFilters.month}
            onValueChange={(value) => updateFilter("month", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All months</SelectItem>
              {MONTHS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="font-primary text-sm font-medium">Tour</label>
          <Select
            value={currentFilters.tourId}
            onValueChange={(value) => updateFilter("tourId", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All tours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All tours</SelectItem>
              {tours.map((tour) => (
                <SelectItem key={tour.id} value={tour.id}>
                  {tour.name}
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
