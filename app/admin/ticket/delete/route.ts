import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body to get reportId
    const { reportId } = await req.json();

    // Validate input
    if (!reportId) {
      return NextResponse.json({ message: "Report ID is required." }, { status: 400 });
    }

    // Delete associated messages first
    await prisma.customerSupportMessage.deleteMany({
      where: { orderId: reportId },
    });

    // Delete the reported problem
    await prisma.reportedProblem.delete({
      where: { id: reportId },
    });

    return NextResponse.json({ success: true, message: "Report and associated messages deleted successfully." });
  } catch (error) {
    console.error("Error deleting report:", error);
    return NextResponse.json({ message: "Failed to delete report." }, { status: 500 });
  }
}
