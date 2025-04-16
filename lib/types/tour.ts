import { DifficultyLevel, Prisma } from "@prisma/client";

export interface Tour {
  id: string;
  name: string;
  description: string;
  difficulty: DifficultyLevel;
  duration: number;
  distance: number;
  startLocation: string;
  endLocation: string;
  maxParticipants: number;
  basePrice: number | Prisma.Decimal;
  published: boolean;
  schedules?: any[];
  // Add other fields as needed
}
