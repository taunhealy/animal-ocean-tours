import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookingId = params.id;
    const { paymentId, status, amount, paymentMethod, transactionDetails } =
      await request.json();

    // Validate the booking exists and belongs to the user
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        userId: session.user.id,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Create a payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount,
        paymentMethod,
        status: status === "COMPLETED" ? "COMPLETED" : "PENDING",
        transactionId: paymentId,
        notes: `PayPal payment ${paymentId}`,
      },
    });

    // Update the booking status and paid amount
    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "CONFIRMED",
        paidAmount: {
          increment: parseFloat(amount),
        },
      },
    });

    // Create an audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "PAYMENT",
        entityType: "BOOKING",
        entityId: bookingId,
        details: {
          paymentId,
          amount,
          method: paymentMethod,
          status,
        },
      },
    });

    return NextResponse.json({
      success: true,
      payment,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
