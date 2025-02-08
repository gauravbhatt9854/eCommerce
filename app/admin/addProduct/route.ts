import { NextResponse } from "next/server";
import minioClient from "../minioS3/route";
import { isAuthorized } from "../checkPoint/route";
import prisma from "@/lib/prisma";

// Helper function to upload file directly to MinIO
async function uploadFileToMinIO(fileBuffer: Buffer, fileName: string) {
  const bucket = process.env.MINIO_BUCKET || "bucket01"; // Replace with your MinIO bucket name

  try {
    // Test MinIO connection in production
    console.log(`Uploading file to MinIO: ${fileName}`);
    await minioClient.putObject(bucket, fileName, fileBuffer);
    
    // Generate a presigned URL for the uploaded file
    const fileUrl = await minioClient.presignedGetObject(bucket, fileName);
    console.log(`File uploaded successfully: ${fileUrl}`);

    return fileUrl;
  } catch (error) {
    console.error("MinIO Upload Error:", error);
    throw new Error("Failed to upload file to MinIO");
  }
}

// Export async POST function to handle image uploads
export async function POST(request: Request) {
  try {
    // Step 1: Check Authorization
    const isAuth = await isAuthorized();
    console.log("Authorization Status:", isAuth);
    
    if (!isAuth) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    // Step 2: Parse Form Data
    const formData = await request.formData();
    const files = formData.getAll("images"); // Get all images from FormData

    console.log("Files received:", files.length);

    if (files.length === 0) {
      return NextResponse.json({ error: "At least one image is required." }, { status: 400 });
    }

    const fileUrls: string[] = [];
    const fileNames: string[] = [];

    // Step 3: Upload Each File to MinIO
    for (const file of files) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `product-images/${Date.now()}-${file.name}`;
        fileNames.push(fileName);

        try {
          // Upload the image to MinIO and get the file URL
          const fileUrl = await uploadFileToMinIO(buffer, fileName);
          fileUrls.push(fileUrl);
        } catch (error) {
          console.error("Error uploading image:", fileName, error);
          return NextResponse.json({ error: "Image upload failed." }, { status: 500 });
        }
      }
    }

    // Step 4: Save Product Data in Prisma
    try {
      const newProduct = await prisma.product.create({
        data: {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          price: parseFloat(formData.get("price") as string),
          categoryId: formData.get("categoryId") as string,
          imageUrls: fileUrls, // Save the array of image URLs
        },
      });

      console.log("Product saved successfully:", newProduct);

      return NextResponse.json({ success: true, product: newProduct });
    } catch (error) {
      console.error("Database Error:", error);
      return NextResponse.json({ error: "Failed to save product." }, { status: 500 });
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
