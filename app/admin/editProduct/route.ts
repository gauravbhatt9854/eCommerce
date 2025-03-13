import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// API route for updating product details
export async function PUT(req: NextRequest) {

         
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
    const { name, description, price , id } = await req.json();

    if (!name || !description || !price) {
        return NextResponse.json({ message: "Missing name, description, or price" }, { status: 400 });
    }

    try {
        // Find the product by ID and update it
        const updatedProduct = await prisma.product.update({
            where: { id: String(id) }, // Ensure the ID is a string if necessary
            data: {
                name,
                description,
                price: Number(price), // Ensure the price is a float
            },
        });

        return NextResponse.json(updatedProduct ,{status: 200});
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
    }
}
