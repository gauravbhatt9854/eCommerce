import { NextRequest, NextResponse } from "next/server";
import minioClient from "../minioS3/client";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Function to delete images from MinIO
async function deleteImagesFromMinIO(imageFilenames: string[]) {
  const bucket = process.env.MINIO_BUCKET!;

  try {
    for (const fileName of imageFilenames) {
      try {
        // Delete the image from MinIO (No need to extract from URL)
        await minioClient.removeObject(bucket, fileName);
        console.log(`✅ Deleted: ${fileName}`);
      } catch (error) {
        console.error(`❌ Error deleting ${fileName}:`, error);
      }
    }

    return NextResponse.json({ message: "Images deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("❌ Error in deleteImagesFromMinIO:", error);
    return NextResponse.json({ message: "Failed to delete images" }, { status: 500 });
  }
}



// DELETE handler to delete product and images
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

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
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    // Find the product by ID
    const product = await prisma.product.findUnique({
      where: { id: String(id) },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Delete images from MinIO
    await deleteImagesFromMinIO(product.imageUrls);

    // Delete the product from the database
    // console.log(`Deleting product with ID: ${id}`);
    await prisma.product.deleteMany({
      where: { id: String(id) },
    });

    return NextResponse.json({ message: "Product and images deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 });
  }
}