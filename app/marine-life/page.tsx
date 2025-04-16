import { Suspense } from "react";
import { Metadata } from "next";
import MarineLifeGrid from "@/app/components/marine-life/marine-life-grid";
import MarineLifeFilters from "@/app/components/marine-life/marine-life-filters";
import { getMarineLifeData } from "@/lib/data/marine-life";
import { GridSkeleton } from "@/app/components/ui/grid-skeleton";

export const metadata: Metadata = {
  title: "Marine Life | Animal Ocean",
  description:
    "Discover the incredible marine species you can encounter during our ocean expeditions.",
};

export default async function MarineLifePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extract filter parameters from URL
  const animalType =
    typeof searchParams.animalType === "string"
      ? searchParams.animalType
      : undefined;
  const season =
    typeof searchParams.season === "string" ? searchParams.season : undefined;
  const tourType =
    typeof searchParams.tourType === "string"
      ? searchParams.tourType
      : undefined;

  // Fetch marine life data with filters applied
  const marineLifeData = await getMarineLifeData({
    animalType,
    season,
    tourType,
  });

  // Get all available filter options for the filter component
  const filterOptions = {
    animalTypes: [
      "Mammals",
      "Fish",
      "Sharks",
      "Rays",
      "Seals",
      "Whales",
      "Dolphins",
    ],
    seasons: ["Summer", "Autumn", "Winter", "Spring"],
    tourTypes: [
      "Seal Snorkeling",
      "Shark Diving",
      "Whale Watching",
      "Dolphin Expedition",
    ],
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-primary text-3xl md:text-4xl font-bold mb-2">
          Marine Life
        </h1>
        <p className="font-primary text-gray-600 max-w-3xl">
          Discover the incredible marine species you can encounter during our
          ocean expeditions. Filter by animal type, season, or expedition to
          find the perfect wildlife experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <MarineLifeFilters
            options={filterOptions}
            currentFilters={{
              animalType,
              season,
              tourType,
            }}
          />
        </div>

        <div className="lg:col-span-3">
          <Suspense fallback={<GridSkeleton columns={3} items={9} />}>
            <MarineLifeGrid marineLifeData={marineLifeData} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
