import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
import { sendProblemEvent } from "@/app/api/services/nodemailerServices";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    } catch (error) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { reportId, status } = await req.json();

    if (!reportId || !status) {
      return NextResponse.json({ message: "Invalid data." }, { status: 400 });
    }

    // Update the status of the report
    const updatedReport = await prisma.reportedProblem.update({
      where: { id: reportId },
      data: { status },
    });

    // Fetch the report with related User and Order
    const fetchedReport = await prisma.reportedProblem.findUnique({
      where: { id: reportId },
      include: { Order: true, User: true },
    });

    // Null-check before sending event
    if (fetchedReport) {
      const msg = await sendProblemEvent(fetchedReport, "problem.resolved");
      console.log(msg?.message);
    } else {
      console.warn("Report not found for sending event");
    }

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error("Failed to update status:", error);
    return NextResponse.json({ message: "Error updating status." }, { status: 500 });
  }
}