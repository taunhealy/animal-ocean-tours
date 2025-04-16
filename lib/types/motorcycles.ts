export interface Motorcycle {
  id: string;
  name: string;
  brand: string;
  category: string;
  engineSize: string;
  pricePerDay: number;
  imageUrl: string;
  description: string;
}

export interface MotorcycleFilters {
  category?: string;
  engineSize?: string;
  price?: string;
}

export interface MotorcycleSortOptions {
  sortBy?: string;
  sortOrder?: string;
}
