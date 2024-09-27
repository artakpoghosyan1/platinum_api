import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { adminRoutes } from "@/config/adminRouts";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "mysecretkey",
);

export async function middleware(req: NextRequest) {
  // Handle CORS first
  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization",
  );

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200 });
  }

  if (req.nextUrl.pathname === "/") {
    // JWT Authentication logic
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL(adminRoutes.signin, req.url));
    }

    return NextResponse.redirect(new URL(adminRoutes.dashboard, req.url));
  }

  try {
    const token = req.cookies.get("token")?.value;

    if (token) {
      await jwtVerify(token, secret);
      return response;
    }
  } catch (error) {
    return NextResponse.redirect(new URL(adminRoutes.signin, req.url)); // Invalid token
  }

  return response;
}
