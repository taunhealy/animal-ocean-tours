/*
  Warnings:

  - You are about to drop the column `departurePort` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `marineArea` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `marineLife` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `marineLifeIds` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `seasons` on the `Tour` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "departurePort",
DROP COLUMN "marineArea",
DROP COLUMN "marineLife",
DROP COLUMN "marineLifeIds",
DROP COLUMN "seasons";

-- CreateTable
CREATE TABLE "MarineLife" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "activeMonths" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarineLife_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TourMarineLife" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TourMarineLife_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TourMarineLife_B_index" ON "_TourMarineLife"("B");

-- AddForeignKey
ALTER TABLE "_TourMarineLife" ADD CONSTRAINT "_TourMarineLife_A_fkey" FOREIGN KEY ("A") REFERENCES "MarineLife"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourMarineLife" ADD CONSTRAINT "_TourMarineLife_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
