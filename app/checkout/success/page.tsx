"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      console.warn("No booking ID found in URL");
      // Optional: Redirect if no bookingId
      // router.push("/tours");
    }
    setIsLoading(false);
  }, [bookingId]);

  if (isLoading) {
    return <div className="text-center p-8">Loading booking details...</div>;
  }

  if (!bookingId) {
    return (
      <div className="container max-w-md mx-auto py-16 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Booking Received!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your booking. Please check your email for
            confirmation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-16 px-4 font-primary">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your booking. Your payment has been processed
          successfully.
        </p>

        {bookingId && (
          <p className="text-sm text-gray-500 mb-6">
            Booking Reference: <span className="font-medium">{bookingId}</span>
          </p>
        )}

        <div className="space-y-3">
          <Button asChild className="w-full font-primary">
            <Link href="/bookings">View My Bookings</Link>
          </Button>
          <Button asChild variant="outline" className="w-full font-primary">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
