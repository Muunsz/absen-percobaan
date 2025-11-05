import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.account.findMany({
      where: {
        role: "VIEW",
      },
      select: {
        id: true,
        username: true,
        nama_lengkap: true,
        role: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching VIEW users:", error);
    return NextResponse.json(
      { error: "Failed to fetch VIEW users" },
      { status: 500 }
    );
  }
}