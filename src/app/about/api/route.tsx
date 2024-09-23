import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Define the allowed origin
const allowedOrigin = "http://localhost:4321";

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
}

// Handle preflight OPTIONS requests
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  setCorsHeaders(response);
  return response;
}

// API route to fetch the "About Us" content from the database
export async function GET() {
  try {
    const pages = await prisma.pages.findFirst();

    if (!pages) {
      const response = NextResponse.json(
        { error: "About Us content not found" },
        { status: 404 },
      );
      setCorsHeaders(response);
      return response;
    }

    const response = NextResponse.json(pages, { status: 200 });
    setCorsHeaders(response);
    return response;
  } catch (error) {
    console.error("Error fetching About Us content:", error);
    const response = NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 },
    );
    setCorsHeaders(response);
    return response;
  }
}

// API route to handle the "About Us" form submission
// API route to handle the "About Us" form submission
export async function POST(req: NextRequest) {
  try {
    const { about, phoneNumber } = await req.json();

    if (!about || !phoneNumber) {
      const response = NextResponse.json(
        { error: "Content and phone number are required" },
        { status: 400 },
      );
      setCorsHeaders(response);
      return response;
    }

    // Check if the "About Us" content already exists
    const existingPage = await prisma.pages.findFirst({
      where: { name: "about" },
    });

    let response;
    if (existingPage) {
      // Update the existing "About Us" content
      const updatedPage = await prisma.pages.update({
        where: { id: existingPage.id },
        data: {
          content: {
            about,
            phoneNumber,
          },
        },
      });

      response = NextResponse.json(
        {
          message: "About Us content updated successfully",
          updatedPage,
        },
        { status: 200 },
      );
    } else {
      // Create new "About Us" content
      const pageData = await prisma.pages.create({
        data: {
          name: "about",
          content: {
            about,
            phoneNumber,
          },
        },
      });

      response = NextResponse.json(
        {
          message: "About Us content saved successfully",
          pageData,
        },
        { status: 201 },
      );
    }

    setCorsHeaders(response);
    return response;
  } catch (error) {
    console.error("Error saving About Us content:", error);
    const response = NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 },
    );
    setCorsHeaders(response);
    return response;
  }
}
