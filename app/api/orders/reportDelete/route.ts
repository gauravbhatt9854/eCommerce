import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    // Get the 'orderId' from the request URL or body (depending on your preferred method)
    const { orderId } = await req.json();

    // Validate input data
    if (!orderId) {
      return NextResponse.json({ message: "Order ID is required." }, { status: 400 });
    }

    // Check if the report exists
    const existingReport = await prisma.reportedProblem.findMany({
      where: { orderId },
    });

    if (!existingReport) {
      return NextResponse.json({ message: "Reported problem not found." }, { status: 404 });
    }

    // Delete the reported problem from the database
    await prisma.reportedProblem.deleteMany({
      where: { orderId },
    });

    return NextResponse.json({ success: true, message: "Reported problem deleted successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to delete the reported problem." }, { status: 500 });
  }
}
