import { Tour as PrismaTour, Prisma, ScheduleType } from "@prisma/client";

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
}> & {
  scheduleType: ScheduleType;
};

// UI-specific helper type that extends the Prisma type
export interface TourListItem extends PrismaTour {
  scheduleType: ScheduleType;
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
  scheduleType: ScheduleType;
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

// You might also want to add a helper type for schedule display
export interface TourScheduleDisplay {
  id: string;
  startDate: Date;
  endDate: Date;
  status: string;
  availableSpots: number;
  price: Prisma.Decimal;
  formattedDuration: string; // e.g., "2 hours" or "3 days"
  formattedTimeRange: string; // e.g., "9:00 AM - 11:00 AM" or "Jun 1 - Jun 3"
}
