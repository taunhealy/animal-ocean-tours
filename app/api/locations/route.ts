import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all locations
export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(locations);
  } catch (error) {
    console.error("GET /api/locations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

// POST new location
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address, latitude, longitude } = body;

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!address?.trim()) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      return NextResponse.json({ error: "Invalid latitude" }, { status: 400 });
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      return NextResponse.json({ error: "Invalid longitude" }, { status: 400 });
    }

    const location = await prisma.location.create({
      data: {
        name: name.trim(),
        address: address.trim(),
        latitude: lat,
        longitude: lng,
        city: "",
        country: "",
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error("POST /api/locations error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 }
    );
  }
}

// PATCH update location
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name, address, latitude, longitude } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Location ID is required" },
        { status: 400 }
      );
    }
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!address?.trim()) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      return NextResponse.json({ error: "Invalid latitude" }, { status: 400 });
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      return NextResponse.json({ error: "Invalid longitude" }, { status: 400 });
    }

    const location = await prisma.location.update({
      where: { id },
      data: {
        name: name.trim(),
        address: address.trim(),
        latitude: lat,
        longitude: lng,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error("PATCH /api/locations error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 }
    );
  }
}

// DELETE location
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Location ID is required" },
        { status: 400 }
      );
    }

    await prisma.location.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/locations error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    );
  }
}
