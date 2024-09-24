import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function GET() {
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: -1, // Expire the cookie
    path: "/", // Ensure the cookie is removed from all paths
  });

  const response = NextResponse.json({ message: "Logged out" }); // No redirection
  response.headers.append("Set-Cookie", cookie);

  return response;
}
