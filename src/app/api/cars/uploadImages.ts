import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function uploadImages(images: File[], carId: number) {
  const uploadDir = path.join(process.cwd(), "/public/uploads");

  // Create the upload directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const imagePromises = images.map(async (image) => {
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename = `${Date.now()}-${image.name}`;
    const filepath = path.join(uploadDir, filename);
    const baseUrl = process.env.BASE_URL;
    const url = `${baseUrl}/public/uploads/${filename}`;

    // Write the image to the file system
    fs.writeFileSync(filepath, buffer);

    // Save image metadata to the database
    await prisma.images.create({
      data: {
        carId: carId,
        filename: filename,
        url: url,
      },
    });
  });

  // Wait for all image processing to complete
  await Promise.all(imagePromises);
}
