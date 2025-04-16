import MotorcycleCard from "./motorcycle-card";
import { fetchMotorcycles } from "@/lib/data/motorcycles";

export default async function MotorcycleGrid({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Server-side data fetching
  const motorcycles = await fetchMotorcycles(searchParams);

  return (
    <div className="w-full">
      {motorcycles.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium">No motorcycles found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-muted-foreground">
            {motorcycles.length}{" "}
            {motorcycles.length === 1 ? "motorcycle" : "motorcycles"} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {motorcycles.map((motorcycle) => (
              <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
