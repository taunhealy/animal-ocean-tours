"use client";

import { useRouter, usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";

// These would typically come from your database or API
const BRANDS = ["All", "BMW", "Honda", "Kawasaki", "KTM", "Suzuki", "Yamaha"];
const CATEGORIES = [
  "All",
  "Adventure",
  "Sport",
  "Cruiser",
  "Touring",
  "Dual Sport",
];
const ENGINE_SIZES = [
  "All",
  "Under 500cc",
  "500-800cc",
  "800-1000cc",
  "Over 1000cc",
];
const PRICE_RANGES = [
  "All",
  "Under $100",
  "$100-$150",
  "$150-$200",
  "Over $200",
];

interface MotorcycleFiltersProps {
  initialBrand?: string;
  initialCategory?: string;
  initialEngineSize?: string;
  initialPrice?: string;
  initialSearch?: string;
}

export default function MotorcycleFilters({
  initialBrand = "All",
  initialCategory = "All",
  initialEngineSize = "All",
  initialPrice = "All",
  initialSearch = "",
}: MotorcycleFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [brand, setBrand] = useState(initialBrand);
  const [category, setCategory] = useState(initialCategory);
  const [engineSize, setEngineSize] = useState(initialEngineSize);
  const [price, setPrice] = useState(initialPrice);
  const [search, setSearch] = useState(initialSearch);

  function handleFilter() {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove params based on filter values
    if (brand && brand !== "All") params.set("brand", brand);
    else params.delete("brand");

    if (category && category !== "All") params.set("category", category);
    else params.delete("category");

    if (engineSize && engineSize !== "All")
      params.set("engineSize", engineSize);
    else params.delete("engineSize");

    if (price && price !== "All") params.set("price", price);
    else params.delete("price");

    if (search) params.set("search", search);
    else params.delete("search");

    router.push(`${pathname}?${params.toString()}`);
  }

  function handleReset() {
    setBrand("All");
    setCategory("All");
    setEngineSize("All");
    setPrice("All");
    setSearch("");
    router.push(pathname);
  }

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-card">
      <h2 className="text-xl font-semibold">Filters</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search motorcycles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger id="brand">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {BRANDS.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="engineSize">Engine Size</Label>
          <Select value={engineSize} onValueChange={setEngineSize}>
            <SelectTrigger id="engineSize">
              <SelectValue placeholder="Select engine size" />
            </SelectTrigger>
            <SelectContent>
              {ENGINE_SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price Range (per day)</Label>
          <Select value={price} onValueChange={setPrice}>
            <SelectTrigger id="price">
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2 pt-2">
          <Button onClick={handleFilter}>Apply Filters</Button>
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
