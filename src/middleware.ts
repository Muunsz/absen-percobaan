// ...existing code...
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";
import { prisma } from "@/lib/prisma";

// Custom JWT payload
interface CustomJWTPayload extends JWTPayload {
  id: string;
  username: string;
  role: "ADMIN" | "GURU" | "SEKRETARIS" | "VIEW";
  id_kelas?: string; // only for SEKRETARIS
}

// Build the secret safely
const jwtSecret = process.env.JWT_SECRET ?? "";
if (!jwtSecret && process.env.NODE_ENV === "development") {
  console.warn("JWT_SECRET is not set. JWT verification will fail.");
}
const secret = new TextEncoder().encode(jwtSecret);

function slugify(v: string) {
  // Normalize a string into a consistent slug form: lower-case, underscores for spaces
  try {
    v = decodeURIComponent(v);
  } catch {
    // keep v as-is if not percent-encoded
  }
  // Replace underscores with spaces (so "foo_bar" and "foo bar" normalize the same),
  // collapse multiple spaces, trim, then replace spaces with underscores and lowercase.
  return v
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s/g, "_");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  let decoded: CustomJWTPayload | null = null;

  // Verify JWT token if it exists
  if (token && jwtSecret) {
    try {
      const { payload } = await jwtVerify(token, secret);
      decoded = payload as CustomJWTPayload;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("JWT verification failed:", (error as Error).message);
      }
    }
  }

  // Redirect authenticated users from root ("/") to dashboard
  if (pathname === "/") {
    if (decoded) {
      switch (decoded.role) {
        case "ADMIN":
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        case "GURU":
          return NextResponse.redirect(new URL("/guru/dashboard", req.url));
        case "SEKRETARIS":
          return NextResponse.redirect(new URL("/sekretaris/dashboard", req.url));
        case "VIEW":
          return NextResponse.redirect(new URL("/view-only/dashboard", req.url));
        default: {
          const response = NextResponse.redirect(new URL("/", req.url));
          response.cookies.delete("auth_token");
          return response;
        }
      }
    }
    return NextResponse.next(); // Show login page
  }

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!decoded || decoded.role !== "ADMIN") {
      const redirectTo = decoded ? "/unauthorized" : "/";
      const response = NextResponse.redirect(new URL(redirectTo, req.url));
      if (!decoded) response.cookies.delete("auth_token");
      return response;
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/view-only")) {
    if (!decoded || decoded.role !== "VIEW") {
      const redirectTo = decoded ? "/unauthorized" : "/";
      const response = NextResponse.redirect(new URL(redirectTo, req.url));
      if (!decoded) response.cookies.delete("auth_token");
      return response;
    }
    return NextResponse.next();
  }

  // Protect /guru routes
  if (pathname.startsWith("/guru")) {
    if (!decoded || decoded.role !== "GURU") {
      const redirectTo = decoded ? "/unauthorized" : "/";
      const response = NextResponse.redirect(new URL(redirectTo, req.url));
      if (!decoded) response.cookies.delete("auth_token");
      return response;
    }

    const response = NextResponse.next();
    if (decoded.id_kelas) {
      response.cookies.set("id_kelas", decoded.id_kelas, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }
    
    return NextResponse.next();
  }

  // Protect /sekretaris routes
  if (pathname.startsWith("/sekretaris")) {
    if (!decoded || decoded.role !== "SEKRETARIS") {
      const redirectTo = decoded ? "/unauthorized" : "/";
      const response = NextResponse.redirect(new URL(redirectTo, req.url));
      if (!decoded) response.cookies.delete("auth_token");
      return response;
    }

    // Prepare response and set id_kelas cookie if present
    const response = NextResponse.next();
    if (decoded.id_kelas) {
      response.cookies.set("id_kelas", decoded.id_kelas, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  }

  return NextResponse.next();
}

// Routes to apply middleware
export const config = {
  matcher: ["/", "/admin/:path*", "/guru/:path*", "/sekretaris/:path*", "/view-only/:path*"],
};
// ...existing code...