import { Prisma } from "@prisma/client";

export interface Tour {
  id: string;
  name: string;
  difficulty: string;
  duration: number;
  marineLifeIds: string[];
  conservationInfo?: string;
  tideDependency: boolean;
  seasons: string[];
  requiredEquipment: string[];
  departurePort: string;
  marineArea?: string;
  expeditionType: string;
  maxParticipants: number;
  basePrice: number; // Decimal handled as number for client-side
  safetyBriefing: string;
  images: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  categoryId?: string;
  guideId?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  startLocation?: { name: string };
  endLocation?: { name: string };
  schedules?: Array<{ id: string }>;
  equipment?: Array<{ equipment: { id: string; name: string } }>;
}
