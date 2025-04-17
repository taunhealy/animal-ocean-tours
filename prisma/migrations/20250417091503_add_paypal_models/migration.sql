/*
  Warnings:

  - You are about to drop the column `notes` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `paymentDate` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaypalOrderStatus" AS ENUM ('CREATED', 'APPROVED', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bookingId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "notes",
DROP COLUMN "paymentDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- CreateTable
CREATE TABLE "PaypalOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "PaypalOrderStatus" NOT NULL,
    "tourId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "participants" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "contactInfo" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaypalOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaypalOrder_orderId_key" ON "PaypalOrder"("orderId");

-- CreateIndex
CREATE INDEX "PaypalOrder_orderId_idx" ON "PaypalOrder"("orderId");

-- CreateIndex
CREATE INDEX "PaypalOrder_tourId_idx" ON "PaypalOrder"("tourId");

-- CreateIndex
CREATE INDEX "PaypalOrder_scheduleId_idx" ON "PaypalOrder"("scheduleId");

-- CreateIndex
CREATE INDEX "Payment_transactionId_idx" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_bookingId_idx" ON "Payment"("bookingId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaypalOrder" ADD CONSTRAINT "PaypalOrder_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaypalOrder" ADD CONSTRAINT "PaypalOrder_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "TourSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
