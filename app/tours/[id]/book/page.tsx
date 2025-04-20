import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingForm from "@/app/components/tours/BookingForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import PayPalCheckout from "@/app/components/checkout/PayPalCheckout";
import { format } from "date-fns";

function formatScheduleTime(startDate: Date, endDate: Date, duration: number) {
  const isSameDay = startDate.toDateString() === endDate.toDateString();

  if (isSameDay) {
    return `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`;
  }

  return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
}

export default async function BookTourPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) {
    return notFound();
  }

  const tour = await prisma.tour.findUnique({
    where: { id: params.id },
    include: {
      schedules: {
        where: {
          startDate: {
            gte: new Date(),
          },
          status: "OPEN",
        },
        orderBy: {
          startDate: "asc",
        },
      },
      startLocation: true,
      tourType: true,
    },
  });

  if (!tour) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 font-primary">{tour.name}</h1>
          <p className="text-gray-600 font-primary">
            Complete your booking for this amazing experience
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-primary">Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingForm
                tourId={tour.id}
                schedules={tour.schedules.map((schedule) => ({
                  ...schedule,
                  startDate: schedule.startDate.toISOString(),
                  endDate: schedule.endDate.toISOString(),
                }))}
                basePrice={tour.basePrice}
                checkoutComponent={PayPalCheckout}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-primary">
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 font-primary">
              <div>
                <h3 className="font-semibold mb-2">Cancellation Policy</h3>
                <p className="text-gray-600">
                  Free cancellation up to 24 hours before the tour.
                  Cancellations within 24 hours of the tour start time may be
                  subject to fees.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">What to Bring</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Comfortable clothing appropriate for weather</li>
                  <li>Sunscreen and hat</li>
                  <li>Camera (optional)</li>
                  <li>Valid ID</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Meeting Point</h3>
                <p className="text-gray-600">
                  {tour.startLocation?.name ||
                    "Details will be provided after booking"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
