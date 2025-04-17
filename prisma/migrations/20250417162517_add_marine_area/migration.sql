/*
  Warnings:

  - You are about to alter the column `amount` on the `PaypalOrder` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the column `location` on the `Tour` table. All the data in the column will be lost.
  - Changed the type of `difficulty` on the `Tour` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MODERATE', 'CHALLENGING', 'EXTREME');

-- AlterTable
ALTER TABLE "PaypalOrder" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "location",
ADD COLUMN     "marineArea" TEXT,
ADD COLUMN     "marineLife" TEXT[],
ADD COLUMN     "marineLifeIds" TEXT[],
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "DifficultyLevel" NOT NULL;
