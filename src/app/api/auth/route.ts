import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { serialize } from "cookie";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "mysecretkey",
);

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (username === "admin" && password === "password123") {
    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    // Set token in an HTTP-only cookie
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use 'secure' in production
      maxAge: 3600,
      path: "/",
    });

    const response = NextResponse.json({ message: "Login successful" });
    response.headers.set("Set-Cookie", cookie);
    return response;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
