import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tourId, scheduleId, participants, totalPrice } = body;

    // Validate the request data
    if (!tourId || !scheduleId || !participants || !totalPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Connect to PayPal API to create an order
    // 2. Store the order details in your database
    // 3. Return the PayPal orderID to the client

    // For demo purposes, create a mock order ID
    const orderID = `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    return NextResponse.json({ orderID });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
