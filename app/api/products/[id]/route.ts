// app/api/products/[id]/route.ts (or .js depending on your file structure)
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
// The GET function now takes a dynamic `id` parameter from the URL
export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    console.log("params in backend for specific product" , id);

    // Fetch product by the provided id using Prisma
    const product = await prisma.product.findUnique({
      where: { id: id }, // Assuming `id` is a string field in your database
    });

    // If the product is found, return it
    if (product) {
        console.log("product found", product);
      return NextResponse.json(product, { status: 200 });
    } else {
      // If no product is found with the given ID, return a 404 response
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
