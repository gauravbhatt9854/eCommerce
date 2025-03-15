import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sendProblemEvent } from "@/app/api/services/rotue";

export async function POST(req: NextRequest) {
  try {
    const { orderId, category, description, userId } = await req.json();

    if (!orderId || !category || !description || !userId) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Create the reported problem in the database
    const reportedProblem = await prisma.reportedProblem.create({
      data: { orderId, userId, category, description },
    });

    // Fetch the reported problem with related Order and User details
    const fetchedReport = await prisma.reportedProblem.findUnique({
      where: { id: reportedProblem.id },
      include: { Order: true, User: true },
    });

    if (!fetchedReport?.Order || !fetchedReport?.User) {
      return NextResponse.json({ message: "Invalid report data. Order or User missing." }, { status: 400 });
    }

    const msg = await sendProblemEvent(fetchedReport, "problem.reported");
    console.log(msg?.message);

    return NextResponse.json({ success: true, reportedProblem });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to report problem" }, { status: 500 });
  }
}
