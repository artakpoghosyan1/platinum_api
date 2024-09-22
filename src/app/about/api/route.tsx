import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// API route to fetch the "About Us" content from the database
export async function GET() {
  try {
    const pages = await prisma.pages.findFirst();

    if (!pages) {
      return NextResponse.json(
        { error: "About Us content not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(pages, { status: 200 });
  } catch (error) {
    console.error("Error fetching About Us content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 },
    );
  }
}

// API route to handle the "About Us" form submission
export async function POST(req: Request) {
  try {
    const { about, phoneNumber } = await req.json();

    if (!about || !phoneNumber) {
      return NextResponse.json(
        { error: "Content and phone number are required" },
        { status: 400 },
      );
    }

    const pageData = await prisma.pages.create({
      data: {
        name: "about",
        content: {
          about,
          phoneNumber,
        },
      },
    });

    return NextResponse.json({
      message: "About Us content saved successfully",
      pageData,
    });
  } catch (error) {
    console.error("Error saving About Us content:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { about, phoneNumber } = await req.json();

    if (!about || !phoneNumber) {
      return NextResponse.json(
        { error: "Content and phone number are required for update" },
        { status: 400 },
      );
    }

    // Update the existing "About Us" content
    const updatedPage = await prisma.pages.updateMany({
      where: { name: "about" },
      data: {
        content: {
          about,
          phoneNumber,
        },
      },
    });

    if (updatedPage.count === 0) {
      return NextResponse.json(
        { error: "About Us content not found for updating" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "About Us content updated successfully",
        updatedPage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating About Us content:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 },
    );
  }
}
