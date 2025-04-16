import { MarineLifeFilters, MarineLifeItem } from "@/lib/types/marine-life";

// Sample data
const marineLifeData: MarineLifeItem[] = [
  {
    id: "1",
    name: "Cape Fur Seal",
    scientificName: "Arctocephalus pusillus",
    description:
      "The Cape fur seal is the largest of the fur seals. They are highly curious and playful animals, making them perfect companions for snorkeling adventures.",
    imageUrl: "/images/marine-life/cape-fur-seal.jpg",
    animalType: "mammals",
    seasons: ["summer", "autumn", "winter", "spring"],
    expeditions: ["Seal Snorkeling", "Seal Island Tour"],
    slug: "cape-fur-seal",
  },
  {
    id: "2",
    name: "Great White Shark",
    scientificName: "Carcharodon carcharias",
    description:
      "The great white shark is a species of large mackerel shark notable for its size and powerful presence in the ocean.",
    imageUrl: "/images/marine-life/great-white-shark.jpg",
    animalType: "sharks",
    seasons: ["winter", "spring"],
    expeditions: ["Shark Diving", "Shark Viewing"],
    slug: "great-white-shark",
  },
  {
    id: "3",
    name: "Southern Right Whale",
    scientificName: "Eubalaena australis",
    description:
      "The southern right whale is a baleen whale that visits South African waters during the winter breeding season.",
    imageUrl: "/images/marine-life/southern-right-whale.jpg",
    animalType: "mammals",
    seasons: ["winter", "spring"],
    expeditions: ["Whale Watching"],
    slug: "southern-right-whale",
  },
];

export async function getMarineLifeData(
  filters: MarineLifeFilters = {}
): Promise<MarineLifeItem[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Apply filters
  return marineLifeData.filter((item) => {
    // Filter by animal type
    if (filters.animalType && item.animalType !== filters.animalType) {
      return false;
    }

    // Filter by season
    if (filters.season && !item.seasons.includes(filters.season)) {
      return false;
    }

    // Filter by tour type
    if (
      filters.tourType &&
      !item.expeditions.some(
        (tour) => tour.toLowerCase() === filters.tourType?.toLowerCase()
      )
    ) {
      return false;
    }

    return true;
  });
}

export async function getMarineLifeBySlug(
  slug: string
): Promise<MarineLifeItem | undefined> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return marineLifeData.find((item) => item.slug === slug);
}

export async function getRelatedMarineLife(
  animalType: string,
  currentId: string
): Promise<MarineLifeItem[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Find related marine life of the same type, excluding the current item
  return marineLifeData
    .filter((item) => item.animalType === animalType && item.id !== currentId)
    .slice(0, 3); // Limit to 3 related items
}
