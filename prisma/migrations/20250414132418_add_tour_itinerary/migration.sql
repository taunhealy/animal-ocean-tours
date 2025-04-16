/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `BookingMotorcycle` table. All the data in the column will be lost.
  - You are about to drop the column `surcharge` on the `TourMotorcycle` table. All the data in the column will be lost.
  - The `experienceLevel` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `riderId` to the `BookingMotorcycle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `Motorcycle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `Motorcycle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seatHeight` to the `Motorcycle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Motorcycle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RidingDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- AlterTable
ALTER TABLE "BookingMotorcycle" DROP COLUMN "assignedTo",
ADD COLUMN     "riderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Motorcycle" ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "difficulty" "RidingDifficulty" NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "seatHeight" INTEGER NOT NULL,
ADD COLUMN     "weight" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TourMotorcycle" DROP COLUMN "surcharge",
ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT,
DROP COLUMN "experienceLevel",
ADD COLUMN     "experienceLevel" "RidingDifficulty";

-- DropEnum
DROP TYPE "ExperienceLevel";

-- CreateTable
CREATE TABLE "TourItinerary" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "distance" INTEGER,
    "activities" TEXT[],
    "meals" TEXT[],
    "highlights" TEXT[],
    "overnight" TEXT,
    "images" TEXT[],

    CONSTRAINT "TourItinerary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TourItinerary" ADD CONSTRAINT "TourItinerary_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
