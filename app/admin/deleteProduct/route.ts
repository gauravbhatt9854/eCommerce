import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import minioClient from "../minioS3/route";
import prisma from "@/lib/prisma";
import { isAuthorized } from "../checkPoint/route";

// Function to delete images from MinIO
async function deleteImagesFromMinIO(imageUrls: string[]) {
  const bucket = process.env.MINIO_BUCKET!
  const baseUrl = process.env.MINIO_ENDPOINT!
  for (const imageUrl of imageUrls) {
      try {
          // Extract object key by removing base URL and bucket name
          const objectKey = imageUrl.replace(`${baseUrl}/${bucket}/`, "");

          // Delete the image from MinIO
          await minioClient.removeObject(bucket, objectKey);
          console.log(`Successfully deleted image: ${objectKey}`);
      } catch (error) {
          console.error(`Error deleting image ${imageUrl}:`, error);
          return NextResponse.json({ message: "Error deleting image from storage" }, { status: 500 });
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