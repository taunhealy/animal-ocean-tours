import { Tour as PrismaTour, Prisma } from "@prisma/client";

// Use Prisma's utility type for tours with relations
export type TourWithRelations = Prisma.TourGetPayload<{
  include: {
    tourType: true;
    marineLife: true;
    startLocation: true;
    endLocation: true;
    schedules: true;
    equipment: true;
  };
}>;

// UI-specific helper type that extends the Prisma type
export interface TourListItem extends PrismaTour {
  startLocation?: { name: string } | null;
  endLocation?: { name: string } | null;
  schedules?: Array<{ id: string }>;
  equipment?: Array<{ equipment: { id: string; name: string } }>;

  // Computed properties for UI
  requiredEquipment?: string[]; // Derived from equipment relation
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  duration: number;
  tourType: string;
  marineLifeIds: string[];
  conservationInfo?: string | null;
  tideDependency: boolean;
  seasons: string[];
  departurePort: string;
  marineArea?: string | null;
  maxParticipants: number;
  basePrice: Prisma.Decimal;
  safetyBriefing: string;
  images: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  categoryId?: string | null;
  guideId?: string | null;
  published: boolean;
  deleted?: boolean | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  startLocation?: { id: string; name: string } | null;
  endLocation?: { id: string; name: string } | null;
  schedules?: Array<{
    id: string;
    startDate: Date;
    endDate: Date;
    status: string;
    availableSpots: number;
    price: Prisma.Decimal;
    guideId?: string | null;
    tourId: string;
    notes?: string | null;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
    conditions?: any;
  }>;
  equipment?: Array<{
    equipment: {
      id: string;
      name: string;
      description?: string | null;
      category?: string | null;
    };
  }>;
  category?: {
    id: string;
    name: string;
    description?: string | null;
  } | null;
  guide?: {
    id: string;
    name?: string | null;
    email: string;
  } | null;

  // Computed properties (if needed in UI)
  requiredEquipment?: string[]; // Derived from equipment relation
}
