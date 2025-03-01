import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import minioClient from "@/app/admin/minioS3/route";

export async function GET() {
  const bucket = process.env.MINIO_BUCKET!;

  try {
    const products = await prisma.product.findMany();

    // Map over products and replace file names with signed URLs
    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        const signedImageUrls = await Promise.all(
          product.imageUrls.map(async (fileName: string) => {
            try {
              return await minioClient.presignedGetObject(bucket, fileName, 86400); // Valid for 24 hours
            } catch (error) {
              console.error("Error generating signed URL for:", fileName, error);
              return null; // Handle errors gracefully
            }
          })
        );
        
        return {
          ...product,
          imageUrls: signedImageUrls.filter((url) => url !== null), // Remove failed URLs
        };
      })
    );

    return NextResponse.json(updatedProducts, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: [] }, { status: 500 });
  }
}
