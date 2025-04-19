/*
  Warnings:

  - You are about to drop the column `tourType` on the `Tour` table. All the data in the column will be lost.
  - Added the required column `tourTypeId` to the `Tour` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "tourType",
ADD COLUMN     "tourTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TourType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TourType_name_key" ON "TourType"("name");

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_tourTypeId_fkey" FOREIGN KEY ("tourTypeId") REFERENCES "TourType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
