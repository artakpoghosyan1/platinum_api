import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";

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
      },
    });

    // Handle images
    const uploadDir = path.join(process.cwd(), "/public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const image of images) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const filename = `${Date.now()}-${image.name}`;
      const filepath = path.join(uploadDir, filename);
      const url = `/uploads/${filename}`;

      fs.writeFileSync(filepath, buffer);

      // Save image info to database
      await prisma.images.create({
        data: {
          carId: newCar.id,
          filename,
          url,
        },
      });
    }

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
