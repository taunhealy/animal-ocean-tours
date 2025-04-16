"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Loader2 } from "lucide-react";

export default function CheckoutPage({
  params,
}: {
  params: { orderId: string };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/checkout/orders/${params.orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data);
        } else {
          // Handle error
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();

    // In a real implementation, you would initialize the PayPal SDK here
    // and render the PayPal buttons
  }, [params.orderId]);

  // For demo purposes, simulate PayPal checkout
  const handleCompletePayment = async () => {
    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to success page
      router.push(`/booking/confirmation?orderId=${params.orderId}`);
    } catch (error) {
      console.error("Payment failed:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Complete Your Payment</h1>

        {/* Order summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h2 className="font-semibold mb-2">Order Summary</h2>
          <p className="text-sm text-gray-600">Order ID: {params.orderId}</p>
          {/* Display order details here */}
        </div>

        {/* PayPal buttons would go here in a real implementation */}
        <div className="mb-6 p-4 border border-gray-200 rounded-md">
          <p className="text-center text-gray-600 mb-4">
            Click the button below to simulate a PayPal payment
          </p>
          <Button
            onClick={handleCompletePayment}
            className="w-full bg-[#0070ba] hover:bg-[#003087]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay with PayPal"
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          By completing this payment, you agree to our Terms of Service and
          Privacy Policy.
        </p>
      </div>
    </div>
  );
}
