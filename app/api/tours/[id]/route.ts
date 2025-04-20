import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Properly await the params in Next.js 15
    const { id } = await context.params;

    const tour = await prisma.tour.findUnique({
      where: {
        id,
        deleted: false,
      },
      include: {
        schedules: true,
        itinerary: {
          orderBy: {
            dayNumber: "asc",
          },
        },
        equipment: {
          include: {
            equipment: true,
          },
        },
        accommodations: true,
        guide: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            guideProfile: true,
          },
        },
        category: true,
        tags: true,
        locationDetails: true,
        startLocation: true,
        endLocation: true,
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    const tour = await prisma.tour.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        difficulty: data.difficulty,
        duration: data.duration,
        locationDetails: data.locationId
          ? {
              connect: { id: data.locationId },
            }
          : undefined,
        maxParticipants: data.maxParticipants,
        basePrice: data.basePrice,
        published: data.published,
        highlights: data.highlights,
        inclusions: data.inclusions,
        exclusions: data.exclusions,
        images: data.images,
        tourType: data.tourType,
        // Optional relations
        categoryId: data.categoryId,
        startLocationId: data.startLocationId,
        endLocationId: data.endLocationId,
        guideId: data.guideId,
      },
    });

    return NextResponse.json(tour);
  } catch (error) {
    console.error("Error updating tour:", error);
    return NextResponse.json(
      { error: "Failed to update tour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Soft delete approach
    await prisma.tour.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tour:", error);
    return NextResponse.json(
      { error: "Failed to delete tour" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const tour = await prisma.tour.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        difficulty: data.difficulty,
        duration: data.duration,
        tourType: {
          connect: { id: data.tourTypeId },
        },
        marineLife: {
          set: data.marineLife.map((id: string) => ({ id })),
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
        published: data.published,
        images: data.images,
        category: data.categoryId
          ? {
              connect: { id: data.categoryId },
            }
          : undefined,
        guide: data.guideId
          ? {
              connect: { id: data.guideId },
            }
          : undefined,
        highlights: data.highlights,
        inclusions: data.inclusions,
        exclusions: data.exclusions,
        conservationInfo: data.conservationInfo,
        tideDependency: data.tideDependency,
        locationDetails: data.locationId
          ? {
              connect: { id: data.locationId },
            }
          : undefined,
      },
    });

    return NextResponse.json(tour);
  } catch (error) {
    console.error("Error updating tour:", error);
    return NextResponse.json(
      { error: "Failed to update tour" },
      { status: 500 }
    );
  }
}
