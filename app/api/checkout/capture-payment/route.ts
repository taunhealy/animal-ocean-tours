import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PayPal API base URLs
const PAYPAL_API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured");
  }

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to get PayPal access token: ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  return data.access_token;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    // Validate order exists
    const order = await prisma.paypalOrder.findUnique({
      where: { orderId: token },
    });

    if (!order) {
      return NextResponse.redirect(new URL("/checkout/cancel", request.url));
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Capture the payment
    const response = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${token}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error("PayPal capture error:", await response.text());
      return NextResponse.redirect(new URL("/checkout/cancel", request.url));
    }

    const captureData = await response.json();

    // Extract the custom data we stored in the order
    const customId = captureData.purchase_units[0].custom_id;
    let bookingData;

    try {
      bookingData = JSON.parse(customId);
    } catch (e) {
      console.error("Error parsing custom data:", e);
      bookingData = {};
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Create booking record in database
    const booking = await prisma.booking.create({
      data: {
        userId: userId || "guest", // Use guest ID if not logged in
        tourScheduleId: bookingData.scheduleId,
        status: "CONFIRMED",
        participants: bookingData.participants,
        totalAmount: parseFloat(captureData.purchase_units[0].amount.value),
        paidAmount: parseFloat(captureData.purchase_units[0].amount.value),
        contactInfo: {
          fullName: bookingData.contactInfo?.fullName || "",
          email: bookingData.contactInfo?.email || "",
          phone: bookingData.contactInfo?.phone || "",
        },
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: parseFloat(captureData.purchase_units[0].amount.value),
        paymentMethod: "PAYPAL",
        status: "COMPLETED",
        transactionId: captureData.id,
        notes: `PayPal payment ${captureData.id}`,
      },
    });

    // Create audit log
    if (userId) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: "PAYMENT",
          entityType: "BOOKING",
          entityId: booking.id,
          details: {
            paymentId: captureData.id,
            amount: captureData.purchase_units[0].amount.value,
            method: "PAYPAL",
            status: "COMPLETED",
          },
        },
      });
    }

    // Redirect to success page with booking ID
    return NextResponse.redirect(
      new URL(`/checkout/success?bookingId=${booking.id}`, request.url)
    );
  } catch (error) {
    console.error("Error capturing payment:", error);
    return NextResponse.redirect(new URL("/checkout/cancel", request.url));
  }
}
