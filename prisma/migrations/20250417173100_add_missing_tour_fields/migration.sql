-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "departurePort" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "expeditionType" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "safetyBriefing" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tideDependency" BOOLEAN NOT NULL DEFAULT false;
