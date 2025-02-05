import { NextResponse } from "next/server";
import minioClient from "../minioS3/route";
import { PrismaClient } from "@prisma/client";
import { isAuthorized } from "../checkPoint/route";

const prisma = new PrismaClient();

// Helper function to upload file directly to MinIO
async function uploadFileToMinIO(fileBuffer: Buffer, fileName: string) {
  const bucket = process.env.MINIO_BUCKET || "bucket01"; // Replace with your MinIO bucket name

  // Upload the file to MinIO
  await minioClient.putObject(bucket, fileName, fileBuffer);

  // Generate a presigned URL for the uploaded file
  const fileUrl = await minioClient.presignedGetObject(bucket, fileName);
  return fileUrl;
}

// Export async POST function to handle image uploads
export async function POST(request: Request) {
  try {
    if(!(await isAuthorized())) return NextResponse.json({ message: "access denied" }, { status: 400 });
    
    const formData = await request.formData();
    const files = formData.getAll("images");  // Use `getAll` to retrieve all files

    if (files.length === 0) {
      return NextResponse.json({ error: "At least one image is required." }, { status: 400 });
    }

    const fileUrls: string[] = [];
    const fileNames = [] as string[];

    // Loop through each image file and upload it to MinIO
    for (const file of files) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `product-images/${Date.now()}-${file.name}`;
        fileNames.push(fileName);

        // Upload the image to MinIO and get the file URL
        const fileUrl = await uploadFileToMinIO(buffer, fileName);
        fileUrls.push(fileUrl);
      }
    }

    // Save product details in Prisma with the image URLs
// Saving product with multiple image URLs
const newProduct = await prisma.product.create({
  data: {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    imageUrls: fileUrls,  // Save the array of image URLs
  },
});

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error uploading images or saving product:", error);
    return NextResponse.json({ error: "Failed to upload images or save product." }, { status: 500 });
  }
}
