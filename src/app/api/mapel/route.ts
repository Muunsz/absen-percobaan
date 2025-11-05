import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { nama } = await req.json();

        if (!nama) {
            return NextResponse.json(
                { error: "mapel name are required" },
                { status: 400 }
            );
        }

        const newMapel = await prisma.mapel.create({
            data: {
              mapel : nama,
            },
          });

          return NextResponse.json(
            { message: "Mapel added successfully" },
            { status: 201 }
          );
    } catch (error) {
        console.error("add mapel error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}