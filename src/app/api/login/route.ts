export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const user = await prisma.account.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const role = user.role?.toUpperCase();

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role,
        id_kelas: user.id_kelas,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user.id, username: user.username, role, id_kelas: user.id_kelas },
      token,
    });

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
