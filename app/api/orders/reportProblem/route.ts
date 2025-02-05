import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Parse JSON from the request body
    const { orderId, category, description, userId } = await req.json();
    console.log({ orderId, category, description, userId });

    // Validate input data
    if (!orderId || !category || !description || !userId) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Create the reported problem in the database using Prisma
    const reportedProblem = await prisma.reportedProblem.create({
      data: {
        orderId,
        userId,
        category,
        description,
      },
    });

    return NextResponse.json({ success: true, reportedProblem });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to report problem" }, { status: 500 });
  }
}
