import nodemailer from 'nodemailer';
import { auth, UserJSON, WebhookEvent } from '@clerk/nextjs/server';
  const auth_ = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });


  export async function sendMail(subject: string, text: string, data: WebhookEvent['data']) {
    let customer = (data as UserJSON).email_addresses[0].email_address;

    if (!customer || !subject || !text) {
        { message: 'Email not sent' }
    }
    if (customer === process.env.EMAIL) {
      console.log('Welcome Admin');
      { message: 'Email not sent' }
    }
    if (customer === 'example@example.org') {
      console.log('Welcome Clerk');
      customer = process.env.T_EMAIL as string;
      subject = 'TEMP SUBJECT';
      text = 'TEMP TEXT JUST FOR TESTING PURPOSE';
    }

    const receiver = {
      from: process.env.EMAIL,
      to: customer,
      subject,
      text,
    };

    try {
      const ans = await auth_.sendMail(receiver);
      if (ans) {
        console.log('Email sent');
        return { message: 'Email sent' };
      }
    } catch (error) {
      console.error('Error while sending email:', error);
      return { message: 'Email not sent' };
    }
  }