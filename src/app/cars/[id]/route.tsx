import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadImages } from "@/app/cars/uploadImages";
import path from "path";
import fs from "fs/promises";

// PUT request handler for updating a car by its ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const carId = Number(params.id); // Extract the car ID from the dynamic route

  try {
    const body = await req.formData();

    // Validate the request body
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const make = body.get("make") as string;
    const model = body.get("model") as string;
    const year = parseInt(body.get("year") as string, 10);
    const vinCode = body.get("vinCode") as string;
    const price = parseFloat(body.get("price") as string);
    const description = body.get("description") as string;
    const color = body.get("color") as string;
    const mileage = parseInt(body.get("mileage") as string, 10);
    const engine = body.get("engine") as string;
    const bodyType = body.get("bodyType") as string;
    const images = body.getAll("images") as File[];

    // Retrieve existing images for the car
    const existingImages = await prisma.images.findMany({
      where: { carId: carId },
    });

    // Determine which images need to be deleted
    const existingImageIds = existingImages.map((image) => image.id);
    const newImageIds = images
      .map((image) => (image as any).id)
      .filter(Boolean);
    const imageIdsToDelete = existingImageIds.filter(
      (id) => !newImageIds.includes(id),
    );

    // Delete images that are no longer associated with the car
    for (const imageId of imageIdsToDelete) {
      const image = existingImages.find((img) => img.id === imageId);
      if (image) {
        const filePath = path.join(
          process.cwd(),
          "public/uploads",
          image.filename,
        );
        await fs.unlink(filePath);
        await prisma.images.delete({ where: { id: imageId } });
      }
    }

    // Update the car using Prisma
    const updatedCar = await prisma.cars.update({
      where: { id: carId },
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

    // Process and upload new images
    await uploadImages(images, updatedCar.id);

    // Return the updated car in the response
    return NextResponse.json(updatedCar, { status: 200 });
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { error: "Failed to update car" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const imageId = Number(params.id);

  try {
    const image = await prisma.images.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    await prisma.images.delete({
      where: { id: imageId },
    });

    const filePath = path.join(process.cwd(), "public/uploads", image.filename);

    await fs.unlink(filePath);

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 },
    );
  }
}
