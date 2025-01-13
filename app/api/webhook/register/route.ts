import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { auth, UserJSON, WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendMail } from '@/app/services/rotue';

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
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  const eventType = evt.type;
  const { data } = evt;
  // user created

  if (eventType === 'user.created') {

    let text: string = `Thank you for registering with us. 
    We are excited to have you on board. 
    Please let us know if you have any queries. 
    We are here to help you. Have a great day ahead
    
    Gaurav Bhatt`;

    let subject: string = 'Welcome to the family';
    
    const newData = data as UserJSON;
    
    type Val = { message: string} | undefined;

    const val:Val = await sendMail(subject, text, data);
    console.log(val?.message)
    if(val?.message !== 'Email sent') return NextResponse.json({ message: 'Email not sent', isOk: false }, { status: 400 });
    
    const dataOfUser =
    {
      id: newData?.id,
      email: newData?.email_addresses[0]?.email_address,
      name: newData?.first_name + " " + newData?.last_name,
      phone: newData?.phone_numbers[0]?.phone_number || "1111111111",
    }

    try {
      const user = await prisma.user.create({
        data: {
          clerkId: dataOfUser.id, // Ensure it's a string
          name: dataOfUser.name,
          email: dataOfUser.email,
          phone: dataOfUser.phone,
        },
      })
      
      if (user) {
        console.log(user)
        return NextResponse.json(
          { user, isOk: true },
          { status: 200 }
        );
      }
    } catch (error) {
      return NextResponse.json({ message: "User creation failed", isOk: false }, { status: 400 })
    }


  } 


  // use deleted

  if (eventType === 'user.deleted') {
    let clerkId: string | undefined = data?.id;
  
    if (typeof clerkId !== 'string' || !clerkId) {
        clerkId ="1";
    }
  
    try {
      // Delete all orders associated with the user
      await prisma.order.deleteMany({
        where: {
          clerkId: clerkId,
        },
      });
  
      // Delete the user account
      await prisma.user.deleteMany({
        where: {
          clerkId: clerkId,
        },
      });
  
      console.log(`Deleted user and orders for clerkId: ${clerkId}`);
    } catch (error) {
      console.error('Error deleting user and associated orders:', error);
      return new Response('Error: Failed to delete user and associated orders', {
        status: 500,
      });
    }
  }
  

  return NextResponse.json('Webhook received', { status: 200 });
}

export async function GET() {
  return NextResponse.json({ message: 'This is a testing route' });
}
