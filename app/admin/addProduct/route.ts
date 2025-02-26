import { NextResponse } from "next/server";
import sharp from "sharp";
import minioClient from "../minioS3/route";
import { isAuthorized } from "../checkPoint/route";
import prisma from "@/lib/prisma";

/**
 * Resizes an image using Sharp before uploading.
 * @param fileBuffer - The original image buffer
 * @returns Resized image buffer
 */
async function resizeImage(fileBuffer: Buffer): Promise<Buffer> {
  return sharp(fileBuffer)
    .resize(2000, 2000, { fit: "cover", position: "center" }) // Ensures a perfect square
    .toBuffer(); // Keeps original quality
}

/**
 * Uploads a file buffer to MinIO and returns the file URL.
 * @param fileBuffer - The processed image buffer
 * @param fileName - The filename to store
 * @returns The URL of the uploaded file
 */
async function uploadFileToMinIO(fileBuffer: Buffer, fileName: string): Promise<string> {
  const bucket = process.env.MINIO_BUCKET!
  const baseUrl = process.env.MINIO_ENDPOINT!;

  try {
    await minioClient.putObject(bucket, fileName, fileBuffer, fileBuffer.length, {
      "Content-Type": "image/jpeg",
    });

    // Construct the file URL manually
    const fileUrl = `${baseUrl}/${bucket}/${fileName}`;
    console.log(`File uploaded successfully: ${fileUrl}`);

    return fileUrl;
  } catch (error) {
    console.error("MinIO Upload Error:", error);
    throw new Error("Failed to upload file to MinIO");
  }
}


/**
 * Handles image upload and product creation request.
 * @param request - The incoming request
 * @returns API response
 */
export async function POST(request: Request): Promise<Response> {
  try {
    // Step 1: Authorization Check
    if (!(await isAuthorized())) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Step 2: Parse FormData
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const files = formData.getAll("images");

    if (files.length === 0) {
      return NextResponse.json({ error: "At least one image is required." }, { status: 400 });
    }

    // Step 3: Process & Upload Each Image
    const fileUrls: string[] = [];
    for (const file of files) {
      if (file instanceof File) {
        const originalBuffer = Buffer.from(await file.arrayBuffer());
        const fileName = `product-images/${Date.now()}-${file.name}`;

        try {
          // Resize image before upload
          const resizedBuffer = await resizeImage(originalBuffer);
          const fileUrl = await uploadFileToMinIO(resizedBuffer, fileName);
          fileUrls.push(fileUrl);
        } catch (error) {
          console.error("Error processing/uploading image:", fileName, error);
          return NextResponse.json({ error: "Image processing or upload failed." }, { status: 500 });
        }
      }
    }

    // Step 4: Save Product Data in Prisma
    try {
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price,
          categoryId,
          imageUrls: fileUrls, // Save resized image URLs
        },
      });

      return NextResponse.json({ success: true, product: newProduct });
    } catch (error) {
      return NextResponse.json({ error: "Failed to save product." }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Unexpected error occurred." }, { status: 500 });
  }
}
