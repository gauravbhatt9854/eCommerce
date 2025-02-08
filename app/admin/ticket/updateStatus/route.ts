
import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "../../checkPoint/route";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    if(!(await isAuthorized())) return NextResponse.json({ message: "access denied" }, { status: 400 });
    const { reportId, status } = await req.json();

    // Validate input data
    if (!reportId || !status) {
      return NextResponse.json({ message: "Invalid data." }, { status: 400 });
    }

    // Update the status of the report
    const updatedReport = await prisma.reportedProblem.update({
      where: { id: reportId },
      data: { status },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error("Failed to update status:", error);
    return NextResponse.json({ message: "Error updating status." }, { status: 500 });
  }
}
