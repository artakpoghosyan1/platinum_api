import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadImages } from "@/app/api/cars/uploadImages";

export const runtime = "nodejs";

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
    const vinUrl = formData.get("vinUrl") as string;
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
        vinUrl,
        ...rates,
      },
    });

    // Process and upload images
    await uploadImages(images, newCar.id);

    return NextResponse.json({
      message: "Car added successfully",
      cars: newCar,
    });
  } catch (error) {
    console.error("Error processing request:", error);

    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const cars = await prisma.cars.findMany({
      include: {
        images: true,
      },
    });

    return NextResponse.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);

    return NextResponse.json({ error: "Error fetching cars" }, { status: 500 });
  }
}
