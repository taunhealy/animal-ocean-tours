import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Incoming request body:", JSON.stringify(body, null, 2));

    // Add validation for all required fields
    const requiredFields = [
      "tourId",
      "scheduleId",
      "participants",
      "totalPrice",
      "contactInfo",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return NextResponse.json(
        { error: "Missing required fields", missing: missingFields },
        { status: 400 }
      );
    }

    // Validate field types
    const typeErrors = [];
    if (typeof body.tourId !== "string")
      typeErrors.push("tourId must be string");
    if (typeof body.scheduleId !== "string")
      typeErrors.push("scheduleId must be string");
    if (typeof body.participants !== "number")
      typeErrors.push("participants must be number");
    if (typeof body.totalPrice !== "number")
      typeErrors.push("totalPrice must be number");

    if (typeErrors.length > 0) {
      console.error("Type validation failed:", typeErrors);
      return NextResponse.json(
        { error: "Type validation failed", details: typeErrors },
        { status: 400 }
      );
    }

    const { tourId, scheduleId, participants, totalPrice, contactInfo } = body;

    // Add contactInfo validation
    const contactValidation = [
      !contactInfo?.fullName && "fullName",
      !contactInfo?.email && "email",
      !contactInfo?.phone && "phone",
    ].filter(Boolean);

    if (contactValidation.length > 0) {
      return NextResponse.json(
        {
          error: "Invalid contact information",
          missing: contactValidation,
        },
        { status: 400 }
      );
    }

    // Add relation existence checks
    const [tourExists, scheduleExists] = await Promise.all([
      prisma.tour.findUnique({ where: { id: tourId } }),
      prisma.tourSchedule.findUnique({ where: { id: scheduleId } }),
    ]);

    if (!tourExists) {
      return NextResponse.json(
        { error: "Invalid tour ID", missing: "tourId" },
        { status: 400 }
      );
    }

    if (!scheduleExists) {
      return NextResponse.json(
        { error: "Invalid schedule ID", missing: "scheduleId" },
        { status: 400 }
      );
    }

    // Validate the request data
    if (!tourId || !scheduleId || !participants || !totalPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Create PayPal order
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: `tour_${tourId}_${scheduleId}`,
            description: `Tour Booking - ${participants} participant(s)`,
            amount: {
              currency_code: "USD",
              value: totalPrice.toFixed(2),
            },
            custom_id: JSON.stringify({
              tourId,
              scheduleId,
              participants,
              contactInfo,
            }),
          },
        ],
        application_context: {
          brand_name: process.env.PAYPAL_APP_NAME || "Animal Ocean",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: `${baseUrl}/api/checkout/capture-payment?success=true`,
          cancel_url: `${baseUrl}/checkout/cancel`,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("PayPal API error:", errorData);
      return NextResponse.json(
        { error: "Failed to create PayPal order" },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Store order details in your database
    // This would typically include saving the PayPal order ID, tour details,
    // customer information, and payment status

    await prisma.paypalOrder.create({
      data: {
        orderId: data.id,
        status: "CREATED",
        tour: { connect: { id: tourId } },
        schedule: { connect: { id: scheduleId } },
        participants,
        amount: totalPrice,
        contactInfo: JSON.stringify(contactInfo),
      },
    });

    return NextResponse.json({
      orderID: data.id,
      approvalUrl: data.links.find((link: any) => link.rel === "approve").href,
    });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : String(error),
        stack:
          process.env.NODE_ENV !== "production"
            ? error instanceof Error
              ? error.stack
              : ""
            : undefined,
      },
      { status: 500 }
    );
  }
}
