import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "mysecretkey",
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    // Verify the JWT
    await jwtVerify(token, secret);
    return NextResponse.next(); // Allow the request to proceed if token is valid
  } catch (error) {
    return NextResponse.redirect(new URL("/signin", req.url)); // Invalid token
  }
}

export const config = {
  matcher: ["/dashboard", "/about"], // Apply middleware to protect this route
};
