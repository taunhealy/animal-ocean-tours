// lib/types/marine-life.ts

export interface MarineLifeFilters {
  animalType?: string;
  season?: string;
  tourType?: string;
}

export interface MarineLifeItem {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  animalType: string;
  seasons: string[];
  expeditions: string[];
  slug: string;
  locations?: string[];
}
