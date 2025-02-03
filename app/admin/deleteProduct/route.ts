import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function DELETE(req: NextRequest) {

          const  user  = await currentUser()
          console.log(user?.publicMetadata.role)
          if(user?.publicMetadata.role !== 'admin')
          {
            return NextResponse.json({message: 'You are not authorized'}, {status: 401})
          }
    const {  id } = await req.json();


    if (!id) {
        return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    try {
        // Find the product by ID and update it
        const updatedProduct = await prisma.product.delete({
            where: { id: String(id) }, // Ensure the ID is a string if necessary
        });
        return NextResponse.json(updatedProduct ,{status: 200});
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
    }
}
