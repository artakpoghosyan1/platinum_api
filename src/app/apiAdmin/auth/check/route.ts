import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "mysecretkey",
);

export async function GET() {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return NextResponse.json({
      isAuthenticated: true,
      username: payload.username,
    });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false });
  }
}
