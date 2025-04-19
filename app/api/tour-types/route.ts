import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const tourTypes = await prisma.tourType.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(tourTypes);
  } catch (error) {
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

    const { name, description } = await request.json();
    const tourType = await prisma.tourType.create({
      data: { name, description },
    });
    return NextResponse.json(tourType);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create tour type" },
      { status: 500 }
    );
  }
}
