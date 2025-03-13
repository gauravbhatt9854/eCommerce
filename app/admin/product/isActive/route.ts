import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        // Extract token from cookies
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Decode token and verify role
        const secret = process.env.JWT_SECRET as string;
        let decoded;
        try {
            decoded = jwt.verify(token, secret) as { role: string };
        } catch (error) {
            return NextResponse.json({ message: "Invalid token" }, { status: 403 });
        }

        const { role } = decoded;

        // Only admin can delete orders
        if (role !== "ADMIN") {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        // Parse order ID from request body
        const body = await req.json();
        const { id } = body;


        let order = await prisma.product.findFirst({
            where: { id: id },
        });

        
        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        // toggle isActive field
        order = await prisma.product.update({
            where: { id: id },
            data: {
                isActive: !order.isActive,
            },
        });
            
        return NextResponse.json({ message: "Active Status successfully updated" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
