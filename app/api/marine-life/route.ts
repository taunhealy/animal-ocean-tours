import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const marineLife = await prisma.marineLife.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(marineLife);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch marine life" },
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

    const body = await request.json();
    const { name, description, image, activeMonths } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!Array.isArray(activeMonths)) {
      return NextResponse.json(
        { error: "activeMonths must be an array" },
        { status: 400 }
      );
    }

    const marineLife = await prisma.marineLife.create({
      data: {
        name,
        description: description || null, // Optional Text field
        image: image || null, // Optional String field
        activeMonths: activeMonths, // Int[]
      },
    });

    return NextResponse.json(marineLife);
  } catch (error) {
    console.error("Error in POST /api/marine-life:", error);
    return NextResponse.json(
      {
        error: "Failed to create marine life",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description, image, activeMonths } = body;

    const marineLife = await prisma.marineLife.update({
      where: { id },
      data: {
        name,
        description,
        image,
        activeMonths,
      },
    });

    return NextResponse.json(marineLife);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update marine life" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.marineLife.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Marine life deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete marine life" },
      { status: 500 }
    );
  }
}
