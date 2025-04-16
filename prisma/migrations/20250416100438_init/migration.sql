/*
  Warnings:

  - The `status` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `distance` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `endLocation` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `route` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `startLocation` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `weatherForecast` on the `TourSchedule` table. All the data in the column will be lost.
  - The `status` column on the `TourSchedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `drivingLicense` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `experienceLevel` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `licenseExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `BookingMotorcycle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Motorcycle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TourMotorcycle` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `equipmentType` on the `EquipmentRental` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `paymentMethod` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `location` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tourType` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `difficulty` on the `Tour` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `TourAccommodation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'STAFF';

-- DropForeignKey
ALTER TABLE "BookingMotorcycle" DROP CONSTRAINT "BookingMotorcycle_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "BookingMotorcycle" DROP CONSTRAINT "BookingMotorcycle_motorcycleId_fkey";

-- DropForeignKey
ALTER TABLE "TourMotorcycle" DROP CONSTRAINT "TourMotorcycle_motorcycleId_fkey";

-- DropForeignKey
ALTER TABLE "TourMotorcycle" DROP CONSTRAINT "TourMotorcycle_tourId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "metadata" JSONB,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "EquipmentRental" DROP COLUMN "equipmentType",
ADD COLUMN     "equipmentType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentPlanId" TEXT,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "distance",
DROP COLUMN "endLocation",
DROP COLUMN "route",
DROP COLUMN "startLocation",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "endLocationId" TEXT,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "locationId" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "startLocationId" TEXT,
ADD COLUMN     "tourType" TEXT NOT NULL,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TourAccommodation" ADD COLUMN     "locationId" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TourSchedule" DROP COLUMN "weatherForecast",
ADD COLUMN     "conditions" JSONB,
ADD COLUMN     "guideId" TEXT,
ADD COLUMN     "metadata" JSONB,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "drivingLicense",
DROP COLUMN "experienceLevel",
DROP COLUMN "licenseExpiry";

-- DropTable
DROP TABLE "BookingMotorcycle";

-- DropTable
DROP TABLE "Motorcycle";

-- DropTable
DROP TABLE "TourMotorcycle";

-- DropEnum
DROP TYPE "AccommodationType";

-- DropEnum
DROP TYPE "BikeType";

-- DropEnum
DROP TYPE "BookingStatus";

-- DropEnum
DROP TYPE "DifficultyLevel";

-- DropEnum
DROP TYPE "EquipmentType";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "RidingDifficulty";

-- DropEnum
DROP TYPE "ScheduleStatus";

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dailyRate" DECIMAL(10,2) NOT NULL,
    "images" TEXT[],
    "available" BOOLEAN NOT NULL DEFAULT true,
    "maintenanceDate" TIMESTAMP(3),
    "features" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "brand" TEXT,
    "size" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourEquipment" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "included" BOOLEAN NOT NULL DEFAULT false,
    "additionalFee" DECIMAL(10,2),

    CONSTRAINT "TourEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingEquipment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "BookingEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "details" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentAvailability" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "tourScheduleId" TEXT,

    CONSTRAINT "EquipmentAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "languages" TEXT[],
    "certifications" TEXT[],
    "specialties" TEXT[],
    "yearsExperience" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,

    CONSTRAINT "GuideProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "experienceLevel" TEXT,
    "dietaryRestrictions" TEXT[],
    "medicalNotes" TEXT,
    "metadata" JSONB,

    CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentPlan" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "installments" INTEGER NOT NULL,
    "frequency" TEXT NOT NULL,

    CONSTRAINT "PaymentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitlistEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tourScheduleId" TEXT NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "participants" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'WAITING',

    CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "TourCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TourTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TourTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuideProfile_userId_key" ON "GuideProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_userId_key" ON "CustomerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentPlan_bookingId_key" ON "PaymentPlan"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "TourCategory_name_key" ON "TourCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "_TourTags_B_index" ON "_TourTags"("B");

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TourCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_startLocationId_fkey" FOREIGN KEY ("startLocationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_endLocationId_fkey" FOREIGN KEY ("endLocationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourSchedule" ADD CONSTRAINT "TourSchedule_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourEquipment" ADD CONSTRAINT "TourEquipment_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourEquipment" ADD CONSTRAINT "TourEquipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourAccommodation" ADD CONSTRAINT "TourAccommodation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingEquipment" ADD CONSTRAINT "BookingEquipment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingEquipment" ADD CONSTRAINT "BookingEquipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_paymentPlanId_fkey" FOREIGN KEY ("paymentPlanId") REFERENCES "PaymentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentAvailability" ADD CONSTRAINT "EquipmentAvailability_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentAvailability" ADD CONSTRAINT "EquipmentAvailability_tourScheduleId_fkey" FOREIGN KEY ("tourScheduleId") REFERENCES "TourSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideProfile" ADD CONSTRAINT "GuideProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentPlan" ADD CONSTRAINT "PaymentPlan_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_tourScheduleId_fkey" FOREIGN KEY ("tourScheduleId") REFERENCES "TourSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourTags" ADD CONSTRAINT "_TourTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourTags" ADD CONSTRAINT "_TourTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
