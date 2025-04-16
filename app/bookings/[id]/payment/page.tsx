"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PayPalButton } from "@/app/components/payment/PayPalButton";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface PaymentPageProps {
  params: {
    id: string;
  };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const response = await fetch(`/api/bookings/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch booking");
        }
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBooking();
  }, [params.id]);

  const handlePaymentSuccess = (details: any) => {
    setPaymentComplete(true);
    // Redirect to confirmation page after a short delay
    setTimeout(() => {
      router.push(`/bookings/${params.id}/confirmation`);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading booking details...</span>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle>Booking Not Found</CardTitle>
            <CardDescription>
              We couldn't find the booking you're looking for.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/bookings")}>
              View My Bookings
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const amountDue = booking.totalAmount - booking.paidAmount;

  return (
    <div className="container mx-auto py-12 font-primary">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>
            Booking #{params.id} for {booking.tourSchedule?.tour?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium mb-2">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Tour:</div>
                <div className="font-medium">
                  {booking.tourSchedule?.tour?.name}
                </div>

                <div>Date:</div>
                <div className="font-medium">
                  {new Date(
                    booking.tourSchedule?.startDate
                  ).toLocaleDateString()}{" "}
                  -{" "}
                  {new Date(booking.tourSchedule?.endDate).toLocaleDateString()}
                </div>

                <div>Participants:</div>
                <div className="font-medium">{booking.participants}</div>

                <div>Total Amount:</div>
                <div className="font-medium">
                  {formatCurrency(booking.totalAmount)}
                </div>

                {booking.paidAmount > 0 && (
                  <>
                    <div>Already Paid:</div>
                    <div className="font-medium">
                      {formatCurrency(booking.paidAmount)}
                    </div>
                  </>
                )}

                <div className="font-semibold">Amount Due:</div>
                <div className="font-semibold">{formatCurrency(amountDue)}</div>
              </div>
            </div>

            {paymentComplete ? (
              <div className="bg-green-50 p-4 rounded-md text-center">
                <h3 className="text-green-700 font-medium text-lg mb-2">
                  Payment Successful!
                </h3>
                <p className="text-green-600">
                  Thank you for your payment. You will be redirected to the
                  confirmation page.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Methods</h3>
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-4">Pay with PayPal</h4>
                  <PayPalButton
                    amount={amountDue}
                    currency="USD"
                    bookingId={params.id}
                    onSuccess={handlePaymentSuccess}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          {paymentComplete && (
            <Button
              onClick={() => router.push(`/bookings/${params.id}/confirmation`)}
            >
              View Confirmation
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
