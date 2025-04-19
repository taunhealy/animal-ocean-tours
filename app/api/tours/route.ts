import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      include: {
        schedules: true,
        itinerary: {
          orderBy: {
            dayNumber: "asc",
          },
        },
        locationDetails: true,
        guide: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            guideProfile: true,
          },
        },
        startLocation: { select: { id: true, name: true } },
        endLocation: { select: { id: true, name: true } },
      },
      where: {
        published: true,
        deleted: false,
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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const tour = await prisma.tour.create({
      data: {
        name: data.name,
        description: data.description,
        difficulty: data.difficulty,
        duration: data.duration,
        tourType: data.tourType,
        marineLife: {
          connect: data.marineLife.map((id: string) => ({ id })),
        },
        startLocation: {
          connect: { id: data.startLocationId },
        },
        endLocation: {
          connect: { id: data.endLocationId },
        },
        basePrice: data.basePrice,
        maxParticipants: data.maxParticipants,
        safetyBriefing: data.safetyBriefing,
        published: data.published || false,
        images: data.images || [],
        categoryId: data.categoryId,
        guideId: data.guideId,
        highlights: data.highlights || [],
        inclusions: data.inclusions || [],
        exclusions: data.exclusions || [],
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
