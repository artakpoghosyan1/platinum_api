import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadImages } from "@/app/cars/uploadImages";

export const runtime = "nodejs";

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*"); // TODO: Artak handle cors
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
}

// Handle preflight OPTIONS requests
export async function OPTIONS() {
  const response = NextResponse.json(null, { status: 204 });
  setCorsHeaders(response);
  return response;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const make = formData.get("make") as string;
    const model = formData.get("model") as string;
    const year = parseInt(formData.get("year") as string, 10);
    const vinCode = formData.get("vinCode") as string;
    const price = parseFloat(formData.get("price") as string);
    const description = formData.get("description") as string;
    const color = formData.get("color") as string;
    const mileage = parseInt(formData.get("mileage") as string, 10);
    const engine = formData.get("engine") as string;
    const bodyType = formData.get("bodyType") as string;
    const images = formData.getAll("images") as File[];
    const ratesData = formData.get("rates") as string | undefined;
    const rates = ratesData ? { rates: JSON.parse(ratesData) } : null;

    // Save car data to database
    const newCar = await prisma.cars.create({
      data: {
        make,
        model,
        year,
        vinCode,
        price,
        description,
        color,
        mileage,
        engine,
        bodyType,
        ...rates,
      },
    });

    // Process and upload images
    await uploadImages(images, newCar.id);

    const response = NextResponse.json({
      message: "Car added successfully",
      cars: newCar,
    });

    // Set CORS headers
    setCorsHeaders(response);

    return response;
  } catch (error) {
    console.error("Error processing request:", error);
    const response = NextResponse.json(
      { error: "Error processing request" },
      { status: 500 },
    );

    // Set CORS headers
    setCorsHeaders(response);

    return response;
  }
}

export async function GET() {
  try {
    const cars = await prisma.cars.findMany({
      include: {
        images: true,
      },
    });

    const response = NextResponse.json(cars);

    // Set CORS headers
    setCorsHeaders(response);

    return response;
  } catch (error) {
    console.error("Error fetching cars:", error);
    const response = NextResponse.json(
      { error: "Error fetching cars" },
      { status: 500 },
    );

    // Set CORS headers
    setCorsHeaders(response);

    return response;
  }
}
