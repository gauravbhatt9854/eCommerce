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
    // if (customer === process.env.EMAIL) {
    //   console.log('Welcome Admin');
    //   { message: 'Email not sent' }
    // }
    if (customer === 'example@example.org') {
      console.log('Welcome Clerk');
      customer = process.env.T_EMAIL as string;
      subject = 'TEMP SUBJECT';
      text = 'TEMP TEXT JUST FOR TESTING PURPOSE';
    }

    const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4CAF50;">Welcome to Our Family!</h2>
          // <p>Dear User'},</p>
          <p>Thank you for registering with us. We are excited to have you on board.</p>
          <p>If you have any queries, feel free to reach out to us. We are here to help you!</p>
          <p>Have a great day ahead.</p>
          <br>
          <p>Best Regards,</p>
          <p><strong>Gaurav Bhatt</strong></p>
        </div>
      </body>
    </html>
  `;

    const receiver = {
      from: process.env.EMAIL,
      to: customer,
      subject,
      text : "",
      html: htmlContent, // HTML email content
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