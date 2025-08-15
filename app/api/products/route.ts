import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import minioClient from "@/app/admin/minioS3/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const MINIO_BUCKET = process.env.MINIO_BUCKET!;

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    } catch (error) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    // Get category filter from query parameters
    const { searchParams } = new URL(request.url);
    const categoryFilter = searchParams.get("category") || "";

    // Define product query based on user role
    const productQuery: any = decoded.role === "ADMIN"
      ? {} // Admin can view all products
      : { isActive: true }; // Normal users see only active products

    if (categoryFilter) {
      productQuery.categoryId = categoryFilter; // Apply category filter
    }

    const products = await prisma.product.findMany({ where: productQuery });

    // Map over products and replace file names with signed URLs
    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        const signedImageUrls = await Promise.all(
          product.imageUrls.map(async (fileName: string) => {
            try {
              return await minioClient.presignedGetObject(MINIO_BUCKET, fileName, 86400); // 24-hour validity
            } catch (error) {
              console.error("Error generating signed URL:", fileName, error);
              return null;
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
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
