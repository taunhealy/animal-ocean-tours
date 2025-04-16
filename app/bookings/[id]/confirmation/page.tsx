import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { CheckCircle } from "lucide-react";

interface ConfirmationPageProps {
  params: {
    id: string;
  };
}

async function getBooking(id: string) {
  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${origin}/api/bookings/${id}`, {
      next: { revalidate: 0 }, // Don't cache this data
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching booking:", error);
    return null;
  }
}

export default async function ConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const booking = await getBooking(params.id);

  if (!booking) {
    notFound();
  }

  const tour = booking.tourSchedule?.tour;
  const schedule = booking.tourSchedule;

  return (
    <div className="container mx-auto py-12 font-primary">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center bg-green-50 border-b">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">
            Booking Confirmed!
          </CardTitle>
          <p className="text-green-700 mt-2">
            Thank you for your booking. We've sent a confirmation to your email.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-1/3 h-48 rounded-lg overflow-hidden">
                <Image
                  src={tour?.images?.[0] || "/images/placeholder.jpg"}
                  alt={tour?.name || "Tour image"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{tour?.name}</h2>
                <p className="text-gray-600 mb-4">{tour?.location}</p>

                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-gray-600">Booking Reference:</div>
                  <div className="font-medium">{booking.id}</div>

                  <div className="text-gray-600">Tour Dates:</div>
                  <div className="font-medium">
                    {formatDate(schedule?.startDate)} -{" "}
                    {formatDate(schedule?.endDate)}
                  </div>

                  <div className="text-gray-600">Participants:</div>
                  <div className="font-medium">{booking.participants}</div>

                  <div className="text-gray-600">Status:</div>
                  <div className="font-medium">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tour Price ({booking.participants} participants)</span>
                  <span>{formatCurrency(booking.totalAmount)}</span>
                </div>

                {booking.payments?.map((payment: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span>Payment ({formatDate(payment.paymentDate)})</span>
                    <span>-{formatCurrency(payment.amount)}</span>
                  </div>
                ))}

                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Balance</span>
                  <span>
                    {formatCurrency(
                      booking.totalAmount - (booking.paidAmount || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">What's Next?</h3>
              <p className="text-gray-700 mb-4">
                You'll receive a detailed itinerary and preparation guide via
                email. If you have any questions, please contact our support
                team.
              </p>
              <p className="text-sm text-gray-600">
                Tour starts at:{" "}
                <span className="font-medium">{tour?.startLocation?.name}</span>
              </p>
              <p className="text-sm text-gray-600">
                Meeting time:{" "}
                <span className="font-medium">
                  {formatDate(schedule?.startDate, true)}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/bookings">View My Bookings</Link>
          </Button>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
