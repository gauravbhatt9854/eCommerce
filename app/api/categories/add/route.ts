import { NextResponse , NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";


export async function POST(request: NextRequest) {
    try {
        // Check if user is authorized
        const token = request.cookies.get("token")?.value;

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

        // Parse request body
        const { name } = await request.json();

        // Validate request
        if (!name || typeof name !== "string") {
            return NextResponse.json({ success: false, message: "Category name is required" }, { status: 400 });
        }

        // Check if category already exists
        const existingCategory = await prisma.category.findUnique({ where: { name } });

        if (existingCategory) {
            return NextResponse.json({
                success: false,
                message: "Category already exists",
                category: existingCategory
            }, { status: 409 });
        }

        // Create new category
        const newCategory = await prisma.category.create({
            data: { name },
        });

        return NextResponse.json({
            success: true,
            message: "Category created successfully",
            category: newCategory
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({
            message: "Internal server error"
        }, { status: 500 });
    }
}
