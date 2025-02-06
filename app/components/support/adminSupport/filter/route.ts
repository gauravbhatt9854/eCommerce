// /app/api/admin/support/filter/route.ts

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { filter, username, orderId } = await req.json();

    let where = {};

    if (filter === "username" && username) {
      where = {
        OR: [
          { sender: { username: { contains: username, mode: "insensitive" } } },
          { receiver: { username: { contains: username, mode: "insensitive" } } },
        ],
      };
    }

    if (filter === "orderId" && orderId) {
      where = { orderId };
    }

    const messages = await prisma.customerSupportMessage.findMany({
      where,
      include: {
        sender: true,
        receiver: true,
        order: true,
      },
      orderBy: {
        timestamp: filter === "old" ? "asc" : "desc",
      },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Error filtering messages:", error);
    return NextResponse.json({ message: "Error filtering messages" }, { status: 500 });
  }
}
