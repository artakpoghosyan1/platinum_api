import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function GET(request: Request) {
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: -1, // Expire the cookie
    path: "/", // Ensure the cookie is removed from all paths
  });

  const url = new URL("/signin", request.url);
  const response = NextResponse.redirect(url);
  response.headers.set("Set-Cookie", cookie);
  return response;
}
