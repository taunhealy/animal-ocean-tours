import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      include: {
        schedules: true,
        motorcycles: {
          include: {
            motorcycle: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const tour = await prisma.tour.create({
      data: {
        name: data.name,
        description: data.description,
        difficulty: data.difficulty,
        duration: data.duration,
        distance: data.distance,
        startLocation: data.startLocation,
        endLocation: data.endLocation,
        maxParticipants: data.maxParticipants,
        basePrice: data.basePrice,
        published: data.published,
        // Default values for required fields
        highlights: [],
        inclusions: [],
        exclusions: [],
        images: [],
      },
    });

    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    console.error("Error creating tour:", error);
    return NextResponse.json(
      { error: "Failed to create tour" },
      { status: 500 }
    );
  }
}
