import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const tourTypes = await prisma.tourType.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(tourTypes);
  } catch (error) {
    console.error("Error fetching tour types:", error);
    return NextResponse.json(
      { error: "Failed to fetch tour types" },
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
    const tourType = await prisma.tourType.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return NextResponse.json(tourType, { status: 201 });
  } catch (error) {
    console.error("Error creating tour type:", error);
    return NextResponse.json(
      { error: "Failed to create tour type" },
      { status: 500 }
    );
  }
}
