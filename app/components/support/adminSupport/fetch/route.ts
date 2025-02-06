// /app/api/support/active-cases/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Endpoint to fetch all unique pairs of orderId and senderId
export async function GET(req: NextRequest) {
  try {
    // Fetch messages with unique orderId and senderId pairs
    const messages = await prisma.customerSupportMessage.findMany({
      distinct: ['orderId', 'senderId' ,'receiverId'], // Get distinct combinations of these fields
      select: {
        orderId: true,
        senderId: true,
      },
    });

    // Return the unique pairs (orderId, senderId)
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching active cases:', error);
    return NextResponse.json({ error: 'Failed to fetch active cases' }, { status: 500 });
  }
}
