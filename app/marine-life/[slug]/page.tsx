import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  getMarineLifeBySlug,
  getRelatedMarineLife,
} from "@/lib/data/marine-life";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const marineLife = await getMarineLifeBySlug(params.slug);

  if (!marineLife) {
    return {
      title: "Marine Life Not Found | Animal Ocean",
    };
  }

  return {
    title: `${marineLife.name} | Animal Ocean Marine Life`,
    description: marineLife.description,
  };
}

export default async function MarineLifeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const marineLife = await getMarineLifeBySlug(params.slug);

  if (!marineLife) {
    notFound();
  }

  const relatedMarineLife = await getRelatedMarineLife(
    marineLife.animalType,
    marineLife.id
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/marine-life"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Marine Life
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border">
            <div className="relative h-[400px] w-full">
              <Image
                src={marineLife.imageUrl}
                alt={marineLife.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{marineLife.animalType}</Badge>
                {marineLife.seasons.map((season) => (
                  <Badge
                    key={season}
                    variant="secondary"
                    className="bg-blue-50"
                  >
                    {season}
                  </Badge>
                ))}
              </div>

              <h1 className="font-primary text-3xl font-bold mb-2">
                {marineLife.name}
              </h1>
              <p className="font-primary text-gray-500 italic mb-6">
                {marineLife.scientificName}
              </p>

              <div className="prose max-w-none">
                <p className="text-gray-700 mb-6">{marineLife.description}</p>

                {marineLife.longDescription && (
                  <div className="mt-6">
                    {marineLife.longDescription
                      .split("\n\n")
                      .map((paragraph, i) => (
                        <p key={i} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional content like facts, habitat info, etc. could go here */}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
            <h2 className="font-primary text-xl font-semibold mb-4">
              Where to See
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium">Best Time to See</h3>
                  <p className="text-gray-600">
                    {marineLife.seasons.join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium">Locations</h3>
                  <p className="text-gray-600">
                    {marineLife.locations?.join(", ") || "Cape Town waters"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Tag className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium">Expeditions</h3>
                  <ul className="text-gray-600 list-disc ml-4 mt-1">
                    {marineLife.expeditions.map((expedition) => (
                      <li key={expedition}>{expedition}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/tours">
                <Button className="w-full">Book an Expedition</Button>
              </Link>
            </div>
          </div>

          {relatedMarineLife.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="font-primary text-xl font-semibold mb-4">
                Related Marine Life
              </h2>

              <div className="space-y-4">
                {relatedMarineLife.map((item) => (
                  <Link href={`/marine-life/${item.slug}`} key={item.id}>
                    <div className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.animalType}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
