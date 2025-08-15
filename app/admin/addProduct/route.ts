import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import minioClient from "../minioS3/client";
import prisma from "@/lib/prisma";

import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

/**
 * Resizes an image using Sharp before uploading.
 * @param fileBuffer - The original image buffer
 * @returns Resized image buffer
 */
async function resizeImage(fileBuffer: Buffer): Promise<Buffer> {
  return sharp(fileBuffer)
    .resize(2000, 2000, { fit: "cover", position: "center" }) // Ensures a perfect square
    .toBuffer();
}

/**
 * Uploads multiple files to MinIO and returns their URLs.
 * @param files - The array of files
 * @returns Array of uploaded image URLs
 */
async function uploadMultipleFilesToMinIO(files: File[]): Promise<string[]> {
  const bucket = process.env.MINIO_BUCKET!;
  const fileUrls: string[] = [];

  for (const file of files) {
    try {
      const originalBuffer = Buffer.from(await file.arrayBuffer());
      const fileName = `product-images/${Date.now()}-${file.name}`;

      // Resize image before upload
      const resizedBuffer = await resizeImage(originalBuffer);
      await minioClient.putObject(bucket, fileName, resizedBuffer, resizedBuffer.length, {
        "Content-Type": "image/jpeg",
      });

      fileUrls.push(`${fileName}`);
    } catch (error) {
      console.error("Error processing/uploading image:", error);
      throw new Error("Image processing or upload failed.");
    }
  }

  return fileUrls;
}

/**
 * Handles image upload and product creation request.
 * @param request - The incoming request
 * @returns API response
 */

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Step 1: Extract Token from Cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Verify Token & Check Admin Role
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    } catch (error) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    
    // Step 3: Parse FormData
    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryIds = formData.getAll("categoryIds") as string[];
    const files = formData.getAll("images") as File[];

    console.log(categoryIds);

    if (!files.length) {
      return NextResponse.json({ error: "At least one image is required." }, { status: 400 });
    }

    // Step 4: Upload Images
    const fileUrls = await uploadMultipleFilesToMinIO(files);

    // Step 5: Save Product Data in Prisma
    try {
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price,
          categoryIds, // Store array of category IDs
          imageUrls: fileUrls, // Save uploaded image URLs
        },
      });

      return NextResponse.json({ success: true, product: newProduct });
    } catch (error) {
      console.error("Error saving product:", error);
      return NextResponse.json({ error: "Failed to save product." }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Unexpected error occurred." }, { status: 500 });
  }
}


