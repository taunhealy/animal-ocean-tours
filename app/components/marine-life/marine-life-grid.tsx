import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import { MarineLife } from "@prisma/client";

interface MarineLifeWithTours extends MarineLife {
  tours: { name: string }[];
}

export default function MarineLifeGrid({
  marineLife,
}: {
  marineLife: MarineLifeWithTours[];
}) {
  if (marineLife.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="font-primary text-xl font-medium mb-2">
          No marine life found
        </h3>
        <p className="font-primary text-gray-500">
          Try adjusting your filters to see more results.
        </p>
      </div>
    );
  }

  const getMonthName = (monthNum: number) => {
    return new Date(0, monthNum - 1).toLocaleString("default", {
      month: "long",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {marineLife.map((animal) => (
        <Link href={`/marine-life/${animal.id}`} key={animal.id}>
          <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-200">
            {animal.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={animal.image}
                  alt={animal.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority={false}
                />
              </div>
            )}
            <CardContent className="p-4">
              <h3 className="font-primary text-lg font-semibold">
                {animal.name}
              </h3>
              <p className="font-primary text-sm text-gray-600 line-clamp-2 mb-3">
                {animal.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {animal.activeMonths.slice(0, 3).map((month) => (
                  <Badge key={month} variant="secondary" className="bg-blue-50">
                    {getMonthName(month)}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0">
              <div className="text-sm font-primary text-gray-600">
                <span className="font-medium">Featured in: </span>
                {animal.tours
                  .slice(0, 2)
                  .map((t) => t.name)
                  .join(", ")}
                {animal.tours.length > 2 && "..."}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
