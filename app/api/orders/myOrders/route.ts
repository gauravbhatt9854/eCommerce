import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
    try {
        // Extract token from cookies
        const token = req.cookies.get("token")?.value; // Change "auth_token" to your actual cookie name

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Verify and decode the token (Replace "your-secret-key" with your actual secret key)
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!) as {id : string}; // Ensure JWT_SECRET is set in .env
        } catch (err) {
            return NextResponse.json({ message: "Invalid token" }, { status: 403 });
        }

        // Extract userId from decoded token
        const userId = decoded?.id;
        
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: {userId : userId },
            include: {
                Product: true,
                DeliveryPerson: true,
                ReportedProblem: true,
            },
        });

        return NextResponse.json(orders, { status: 200 });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
