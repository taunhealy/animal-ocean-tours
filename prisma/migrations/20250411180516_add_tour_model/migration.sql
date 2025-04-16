-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'GUIDE', 'ADMIN');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "BikeType" AS ENUM ('ADVENTURE', 'CRUISER', 'SPORT', 'TOURING', 'DUAL_SPORT', 'OFF_ROAD');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MODERATE', 'CHALLENGING', 'EXTREME');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('OPEN', 'FULL', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "AccommodationType" AS ENUM ('HOTEL', 'LODGE', 'CAMPING', 'GUESTHOUSE', 'RESORT');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('HELMET', 'JACKET', 'GLOVES', 'BOOTS', 'GPS', 'LUGGAGE', 'CAMERA', 'COMMUNICATION');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL', 'CASH', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "phone" TEXT,
    "address" TEXT,
    "emergencyContact" TEXT,
    "drivingLicense" TEXT,
    "licenseExpiry" TIMESTAMP(3),
    "experienceLevel" "ExperienceLevel",
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motorcycle" (
    "id" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "engineSize" INTEGER NOT NULL,
    "type" "BikeType" NOT NULL,
    "description" TEXT,
    "dailyRate" DECIMAL(10,2) NOT NULL,
    "images" TEXT[],
    "available" BOOLEAN NOT NULL DEFAULT true,
    "maintenanceDate" TIMESTAMP(3),
    "features" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Motorcycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL,
    "duration" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "startLocation" TEXT NOT NULL,
    "endLocation" TEXT NOT NULL,
    "route" JSONB,
    "highlights" TEXT[],
    "inclusions" TEXT[],
    "exclusions" TEXT[],
    "maxParticipants" INTEGER NOT NULL,
    "basePrice" MONEY NOT NULL,
    "images" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "guideId" TEXT,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourSchedule" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "availableSpots" INTEGER NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'OPEN',
    "weatherForecast" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourMotorcycle" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "motorcycleId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "surcharge" DECIMAL(10,2),

    CONSTRAINT "TourMotorcycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourAccommodation" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "nightNumber" INTEGER NOT NULL,
    "type" "AccommodationType" NOT NULL,
    "amenities" TEXT[],
    "images" TEXT[],

    CONSTRAINT "TourAccommodation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tourScheduleId" TEXT NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "paidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "participants" INTEGER NOT NULL,
    "specialRequests" TEXT,
    "insuranceOption" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingMotorcycle" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "motorcycleId" TEXT NOT NULL,
    "assignedTo" TEXT,

    CONSTRAINT "BookingMotorcycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentRental" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "equipmentType" "EquipmentType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "pricePerDay" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "EquipmentRental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "notes" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "tourHighlight" TEXT,
    "photos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourSchedule" ADD CONSTRAINT "TourSchedule_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourMotorcycle" ADD CONSTRAINT "TourMotorcycle_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourMotorcycle" ADD CONSTRAINT "TourMotorcycle_motorcycleId_fkey" FOREIGN KEY ("motorcycleId") REFERENCES "Motorcycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourAccommodation" ADD CONSTRAINT "TourAccommodation_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tourScheduleId_fkey" FOREIGN KEY ("tourScheduleId") REFERENCES "TourSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingMotorcycle" ADD CONSTRAINT "BookingMotorcycle_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingMotorcycle" ADD CONSTRAINT "BookingMotorcycle_motorcycleId_fkey" FOREIGN KEY ("motorcycleId") REFERENCES "Motorcycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentRental" ADD CONSTRAINT "EquipmentRental_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
