-- DropForeignKey
ALTER TABLE "PaypalOrder" DROP CONSTRAINT "PaypalOrder_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "PaypalOrder" DROP CONSTRAINT "PaypalOrder_tourId_fkey";

-- AddForeignKey
ALTER TABLE "PaypalOrder" ADD CONSTRAINT "PaypalOrder_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaypalOrder" ADD CONSTRAINT "PaypalOrder_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "TourSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
