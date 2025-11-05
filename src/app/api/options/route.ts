import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const options = await prisma.mapel.findMany({
      select: {
        id: true,
        mapel: true,
      },
      orderBy: {
        mapel: "asc", // optional: sort alphabetically
      },
    });

    return NextResponse.json(options, { status: 200 });
  } catch (error) {
    console.error("Error fetching options:", error);
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 }
    );
  }
}