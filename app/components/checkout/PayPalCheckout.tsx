"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PayPalCheckoutProps {
  bookingData: {
    tourId: string;
    scheduleId: string;
    participants: number;
    totalPrice: number;
    // Add any other booking data needed
  };
  onSuccess: (transactionId: string) => void;
  onError: (error: Error) => void;
}

export default function PayPalCheckout({
  bookingData,
  onSuccess,
  onError,
}: PayPalCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // Call your API to create a PayPal order
      const response = await fetch("/api/checkout/create-paypal-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error("Failed to create PayPal order");
      }

      const { orderID } = await response.json();

      // Redirect to PayPal checkout page
      // You can also use PayPal SDK for a more integrated experience
      router.push(`/checkout/${orderID}`);

      // For demo purposes, simulate a successful transaction
      // In production, you would handle the PayPal callback
      // onSuccess("demo-transaction-id");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      onError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      className="w-full bg-[#0070ba] hover:bg-[#003087] text-white"
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : "Proceed to Checkout"}
    </Button>
  );
}
