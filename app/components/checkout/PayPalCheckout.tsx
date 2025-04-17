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
    contactInfo: {
      fullName: string;
      email: string;
      phone: string;
    };
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
      // Log what we're sending
      console.log("Sending booking data:", {
        tourId: bookingData.tourId,
        scheduleId: bookingData.scheduleId,
        participants: bookingData.participants,
        totalPrice: bookingData.totalPrice,
        contactInfo: bookingData.contactInfo,
      });

      if (!bookingData.contactInfo?.email || !bookingData.contactInfo?.phone) {
        throw new Error("Missing contact information");
      }

      const response = await fetch("/api/checkout/create-paypal-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          tourId: bookingData.tourId,
          scheduleId: bookingData.scheduleId,
          participants: Number(bookingData.participants),
          totalPrice: parseFloat(bookingData.totalPrice.toString()),
          contactInfo: bookingData.contactInfo,
          currency: "USD",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error Details:", data);
        throw new Error(
          data.error?.message ||
            `Payment failed with status ${response.status} - ${JSON.stringify(data)}`
        );
      }

      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        throw new Error("Missing PayPal approval URL");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Payment Failed", {
        description: errorMessage,
        action: {
          label: "Retry",
          onClick: () => handleCheckout(),
        },
      });
      onError(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      className="w-full bg-primary hover:bg-primary-dark text-black font-primary"
      disabled={isLoading}
    >
      {isLoading ? "Processing payment..." : "Proceed to PayPal Checkout"}
    </Button>
  );
}
