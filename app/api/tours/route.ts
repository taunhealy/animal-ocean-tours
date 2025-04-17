import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getMarineLifeData } from "@/lib/data/marine-life";

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
    const data = await request.json();

    // Validate marine life IDs exist
    const marineLifeData = await getMarineLifeData();
    const validMarineLifeIds = marineLifeData.map((item) => item.id);

    const invalidMarineLifeIds = data.marineLifeIds.filter(
      (id: string) => !validMarineLifeIds.includes(id)
    );

    if (invalidMarineLifeIds.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid marine life IDs: ${invalidMarineLifeIds.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Get marine life names for display
    const selectedMarineLife = marineLifeData
      .filter((item) => data.marineLifeIds.includes(item.id))
      .map((item) => item.name);

    const tourData = {
      ...data,
      startLocationId: data.startLocationId,
      endLocationId: data.endLocationId,
    };

    const tour = await prisma.tour.create({
      data: {
        // Core tour information
        name: tourData.name,
        description: tourData.description,
        difficulty: tourData.difficulty,
        duration: tourData.duration,

        // Marine-specific fields
        marineLife: selectedMarineLife,
        marineLifeIds: tourData.marineLifeIds,
        startLocation: tourData.startLocation.name,
        endLocation: tourData.endLocation.name,
        marineArea: tourData.marineArea,
        seasons: tourData.seasons,
        expeditionType: tourData.expeditionType,

        // Pricing and capacity
        basePrice: tourData.basePrice,
        maxParticipants: tourData.maxParticipants,

        // Safety and equipment
        requiredEquipment: tourData.requiredEquipment || [],
        safetyBriefing: tourData.safetyBriefing,

        // Media and visibility
        published: tourData.published || false,
        images: tourData.images || [],

        // Relationships
        categoryId: tourData.categoryId || "MARINE_EXPERIENCE",
        guideId: tourData.guideId,

        // Default values for required schema fields
        highlights: tourData.highlights || [
          "Marine life observation",
          "Educational commentary",
        ],
        inclusions: tourData.inclusions || ["Safety equipment", "Expert guide"],
        exclusions: tourData.exclusions || [
          "Transportation to departure point",
        ],
      },
    });

    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    console.error("Error creating tour:", error);
    return NextResponse.json(
      { error: "Failed to create marine experience" },
      { status: 500 }
    );
  }
}
