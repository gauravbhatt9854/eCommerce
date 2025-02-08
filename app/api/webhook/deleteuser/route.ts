import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;


  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  const wh = new Webhook(SIGNING_SECRET);
  const headerPayload = await headers();

  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  const eventType = evt.type;

  const { data } = evt;


  if (eventType === 'user.deleted') {
    const { id: userId } = data;


    try {
      // Delete all orders associated with the user
      await prisma.order.deleteMany({
        where: {
          userId: userId,
        },
      });

      // Delete the user account
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });
      
    } catch (error) {
      console.error('Error deleting user and associated orders:', error);
      return new Response('Error: Failed to delete user and associated orders', {
        status: 500,
      });
    }
  }

  return NextResponse.json('Webhook received', { status: 200 });
}
