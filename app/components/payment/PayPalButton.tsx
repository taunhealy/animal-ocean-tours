"use client";

import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";

interface PayPalButtonProps {
  amount: number;
  currency: string;
  bookingId: string;
  onSuccess: (details: any) => void;
  onError?: (error: any) => void;
}

export function PayPalButton({
  amount,
  currency = "USD",
  bookingId,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Validate props before rendering PayPal
    if (amount <= 0) {
      console.error("PayPal amount must be greater than 0");
      return;
    }
    setIsReady(true);
  }, [amount]);

  if (!isReady) return null;

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency,
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical", shape: "rect" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: `Booking #${bookingId}`,
                amount: {
                  value: amount.toString(),
                  currency_code: currency,
                },
                reference_id: bookingId,
              },
            ],
            application_context: {
              shipping_preference: "NO_SHIPPING",
            },
          });
        }}
      />
    </PayPalScriptProvider>
  );
}
