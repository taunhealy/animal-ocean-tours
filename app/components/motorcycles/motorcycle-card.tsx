import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Motorcycle } from "@/lib/types/motorcycles";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/components/ui/card";

export default function MotorcycleCard({
  motorcycle,
}: {
  motorcycle: Motorcycle;
}) {
  return (
    <Card>
      <CardHeader>
        <h3>{motorcycle.name}</h3>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 w-full">
          <Image
            src={motorcycle.imageUrl}
            alt={motorcycle.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <p className="text-muted-foreground">
          {motorcycle.category} • {motorcycle.engineSize}
        </p>
        <p className="font-medium">${motorcycle.pricePerDay} per day</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full mt-2" asChild>
          <Link href={`/motorcycles/${motorcycle.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
