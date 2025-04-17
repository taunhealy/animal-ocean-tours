"use client";

import { Button } from "@/app/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="container max-w-md mx-auto py-16 px-4 font-primary">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment process was cancelled. No charges have been made.
        </p>

        <div className="space-y-3">
          <Link href="/tours">
            <Button className="w-full font-primary">Browse Tours</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full font-primary">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
