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


async function sendAccountCreationEmail(data: WebhookEvent['data']) {
  let subject: string = 'Welcome to the family';
  let customer = (data as UserJSON).email_addresses[0].email_address;
  let name = (data as UserJSON).first_name + ' ' + (data as UserJSON).last_name;
  let text = "";

  if (!customer || !subject) {
    { message: 'Email not sent' }
  }

  if (customer === 'example@example.org') {
    customer = process.env.T_EMAIL as string;
    subject = 'TEMP SUBJECT';
    text = 'TEMP TEXT JUST FOR TESTING PURPOSE';
  }

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #4CAF50;">Welcome to Our Family, ${name}!</h2>
          <p style="font-size: 16px;">Dear ${name},</p>
          <p style="font-size: 14px;">Thank you for registering with us. We are thrilled to have you on board. Your journey with us starts now!</p>
          <p style="font-size: 14px;">If you have any queries, feel free to reach out. We are here to help you!</p>
          <br>
          <a href="https://oc.golu.codes" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Continue Shopping</a>
          <br><br>
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
    text: "",
    html: htmlContent, // HTML email content
  };

  try {
    const ans = await auth_.sendMail(receiver);
    if (ans) {
      return { message: 'Email sent' };
    }
  } catch (error) {
    console.error('Error while sending email:', error);
    return { message: 'Email not sent' };
  }
}


async function sendAccountDeletionEmail(tempUser: {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  if (!tempUser ) {
    console.error("No user found to send deletion email.");
    return { message: "No user found." };
  }

  const user = tempUser;
    const subject = "Your Account Has Been Deleted";
    const text = `Dear ${user.name},\n\nYour account associated with ${user.email} has been successfully deleted. If you did not request this deletion, please contact our support team immediately.\n\nBest Regards,\nGaurav Bhatt`;

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #E53935;">Account Deleted Successfully</h2>
            <p style="font-size: 16px;">Dear ${user.name},</p>
            <p style="font-size: 14px;">Your account with email <strong>${user.email}</strong> has been successfully deleted.</p>
            <p style="font-size: 14px;">If this was not done by you or if you wish to recover your account, please contact our support team immediately.</p>
            <br>
            <a href="mailto:support@example.com" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #E53935; text-decoration: none; border-radius: 5px;">Contact Support</a>
            <br><br>
            <p>Best Regards,</p>
            <p><strong>Gaurav Bhatt</strong></p>
          </div>
        </body>
      </html>
    `;

    const receiver = {
      from: process.env.EMAIL, // Your system email
      to: user.email, // User's email
      subject,
      text,
      html: htmlContent,
    };

    try {
      const ans = await auth_.sendMail(receiver);
      if (ans) {
        return { message: 'Email sent' };
      }
    } catch (error) {
      console.error(`Error while sending email to ${user.email}:`, error);
      return { message: 'Email not sent' };
      
    }
  }


export { sendAccountDeletionEmail , sendAccountCreationEmail };

