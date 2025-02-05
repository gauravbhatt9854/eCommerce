import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import minioClient from "../minioS3/route";
import prisma from "@/lib/prisma";
import { isAuthorized } from "../checkPoint/route";

// Function to delete images from MinIO
async function deleteImagesFromMinIO(imageUrls: string[]) {
    const bucket = process.env.MINIO_BUCKET || "your-bucket-name"; // Your MinIO bucket name
  
    for (const imageUrl of imageUrls) {
      // Extract the object key by removing the base URL and query parameters
      const objectKey = imageUrl.split("?")[0].replace(`https://${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}/`, "");
      
      try {
        // Delete the image from MinIO
        await minioClient.removeObject(bucket, objectKey);
        console.log(`Successfully deleted image: ${objectKey}`);
      } catch (error) {
        console.error(`Error deleting image ${objectKey}:`, error);
        throw new Error("Failed to delete images from MinIO");
      }
    }
  }
  
  // DELETE handler to delete product and images
  export async function DELETE(req: NextRequest) {
    try {
      if(!(await isAuthorized())) return NextResponse.json({ message: "access denied" }, { status: 400 });
      const { id } = await req.json();
      const user = await currentUser();
  
      if (user?.publicMetadata.role !== 'admin') {
        return NextResponse.json({ message: 'You are not authorized' }, { status: 401 });
      }
  
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
      await prisma.product.delete({
        where: { id: String(id) },
      });
  
      return NextResponse.json({ message: "Product and images deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json({ message: "Failed to delete product" }, { status: 500 });
    }
  }