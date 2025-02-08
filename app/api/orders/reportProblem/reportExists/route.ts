import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const reportedProblem = await prisma.reportedProblem.findFirst({
      where: { orderId },
    });

    return NextResponse.json({ hasReportedProblem: !!reportedProblem });
  } catch (error) {
    console.error("Error checking reported problem:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
