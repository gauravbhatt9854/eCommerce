import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import minioClient from "@/app/admin/minioS3/client";

export async function POST(req: Request) {
  const bucket = process.env.MINIO_BUCKET!;

  try {
    const { id } = await req.json();

    // Fetch product by ID
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Convert stored filenames into signed URLs
    const signedImageUrls = await Promise.all(
      product.imageUrls.map(async (fileName: string) => {
        try {
          return await minioClient.presignedGetObject(bucket, fileName, 86400); // 24-hour expiry
        } catch (error) {
          console.error("Error generating signed URL for:", fileName, error);
          return null; // Ignore failed URLs
        }
      })
    );

    // Return product with updated image URLs
    return NextResponse.json(
      {
        ...product,
        imageUrls: signedImageUrls.filter((url) => url !== null), // Remove failed URLs
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
