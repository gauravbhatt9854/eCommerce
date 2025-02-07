import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { isAuthorized } from "@/app/admin/checkPoint/route";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        // Check if user is authorized
        if (!(await isAuthorized())) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
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
