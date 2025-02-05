import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "../checkPoint/route";

// API route for updating product details
export async function PUT(req: NextRequest) {

         
    if(!(await isAuthorized())) return NextResponse.json({ message: "access denied" }, { status: 400 });
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
