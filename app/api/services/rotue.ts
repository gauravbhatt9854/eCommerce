import nodemailer from 'nodemailer';
import { User , Order , ReportedProblem } from '@prisma/client';

const auth_ = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

async function sendUserEvent(user: User, eventName: string) {
  console.log("event Name : " , eventName);
  let customer = user?.email;
  let name = user?.name;

  if (!customer || !name) {
    return { message: "Invalid user details" };
  }

  if (eventName === "user.created") {
    let subject = "Welcome to the family";

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
      text: `Welcome ${name}! Thank you for registering with us.`,
      html: htmlContent,
    };

    try {
      const ans = await auth_.sendMail(receiver);
      return ans ? { message: "Email sent" } : { message: "Email not sent" };
    } catch (error) {
      console.error("Error while sending email:", error);
      return { message: "Email not sent" };
    }
  }

  if (eventName === "user.passwordReset") {
    let subject = "Password Reset Successfully";

    const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #4CAF50;">Your Password Has Been Reset Successfully</h2>
          <p style="font-size: 16px;">Dear ${name},</p>
          <p style="font-size: 14px;">Your password has been reset successfully. You can now log in using your new password.</p>
          <br>
          <a href="https://oc.golu.codes/login" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Login Now</a>
          <br><br>
          <p>If you did not reset your password, please contact support immediately.</p>
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
      text: `Dear ${name}, your password has been reset successfully. If this wasn't you, please contact support immediately.`,
      html: htmlContent,
    };

    try {
      const ans = await auth_.sendMail(receiver);
      return ans ? { message: "Password reset confirmation email sent" } : { message: "Email not sent" };
    } catch (error) {
      console.error("Error while sending password reset confirmation email:", error);
      return { message: "Email not sent" };
    }
  }
}

async function sendOrderEvent(order: Order, eventName: string) {
  console.log("event Name : " , eventName);
  let customer = order.User?.email;
  let name = order.User?.name;
  let text = "";

  if (!customer || !name) {
    return { message: "Invalid order details" };
  }

  if (eventName === "order.placed") {
    let subject = "Order Placed Successfully";

    // Get Product Details
    let productName = order.Product?.name || "Unknown Product";
    let productDescription = order.Product?.description || "No description available";
    let productQuantity = order.quantity || 1;

    const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #4CAF50;">Your Order Has Been Placed Successfully!</h2>
          <p style="font-size: 16px;">Dear ${name},</p>
          <p style="font-size: 14px;">Thank you for your order. Your order ID is <strong>${order.id}</strong>.</p>
          <p style="font-size: 14px;">Total Amount: <strong>₹${order.totalAmount}</strong></p>
          <p style="font-size: 14px;">Delivery Address: ${order.deliveryAddress || "Not Provided"}</p>
          <p style="font-size: 14px;">Estimated Delivery Date: ${order.deliveryDate ? order.deliveryDate.toDateString() : "TBD"}</p>

          <hr>

          <h3>Product Details</h3>
          <p style="font-size: 14px;"><strong>Product Name:</strong> ${productName}</p>
          <p style="font-size: 14px;"><strong>Description:</strong> ${productDescription}</p>
          <p style="font-size: 14px;"><strong>Quantity:</strong> ${productQuantity}</p>

          <br>
          <a href="https://oc.golu.codes/orders/${order.id}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Track Order</a>
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
      text: `Your order has been placed successfully. Order ID: ${order.id}. Total Amount: ₹${order.totalAmount}.
      Product: ${productName} (Quantity: ${productQuantity}).`,
      html: htmlContent,
    };

    try {
      const ans = await auth_.sendMail(receiver);
      if (ans) {
        return { message: "Email sent" };
      }
    } catch (error) {
      console.error("Error while sending email:", error);
      return { message: "Email not sent" };
    }
  }
}

async function sendOtpEmail(email: string, name: string, otp: string) {

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Dear ${name},\n\nYour OTP code is: ${otp}. It is valid for 10 minutes.\n\nBest Regards,\nGaurav Bhatt`,
    html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
              <h2 style="color: #E53935;">Your OTP Code</h2>
              <p style="font-size: 16px;">Dear ${name},</p>
              <p style="font-size: 14px;">Your OTP code is: <strong>${otp}</strong></p>
              <p style="font-size: 14px;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
              <br>
              <p>Best Regards,</p>
              <p><strong>Gaurav Bhatt</strong></p>
            </div>
          </body>
        </html>
      `,
  };

  try {
    const ans = await auth_.sendMail(mailOptions);
    if (ans) {
      return { message: 'Email sent' };
    }
  } catch (error) {
    console.error('Error while sending email:', error);
    return { message: 'Email not sent' };
  }
}

async function sendProblemEvent(reportedProblem : ReportedProblem, eventName:string) {
  console.log("Event Name:", eventName);
  
  let customer = reportedProblem.User?.email;
  let name = reportedProblem.User?.name;
  let orderId = reportedProblem.orderId;
  let category = reportedProblem.category;
  let description = reportedProblem.description;
  let status = reportedProblem.status;
  
  if (!customer || !name || !orderId) {
    return { message: "Invalid problem details" };
  }
  
  if (eventName === "problem.reported" || eventName === "problem.resolved") {
    let subject = eventName === "problem.reported" 
      ? "Issue Reported for Your Order" 
      : "Issue Resolved for Your Order";
    
    const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: ${eventName === "problem.reported" ? "#FF5722" : "#4CAF50"};">${subject}</h2>
          <p style="font-size: 16px;">Dear ${name},</p>
          <p style="font-size: 14px;">Your issue regarding order <strong>${orderId}</strong> has been ${eventName === "problem.reported" ? "reported" : "resolved"}.</p>
          <p style="font-size: 14px;"><strong>Category:</strong> ${category}</p>
          <p style="font-size: 14px;"><strong>Description:</strong> ${description}</p>
          <p style="font-size: 14px;"><strong>Current Status:</strong> ${status}</p>
          
          <br>
          <a href="https://oc.golu.codes/orders/${orderId}/issues" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: ${eventName === "problem.reported" ? "#FF5722" : "#4CAF50"}; text-decoration: none; border-radius: 5px;">View Issue</a>
          <br><br>
          <p>We will update you on any further progress.</p>
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
      text: `Your issue has been ${eventName === "problem.reported" ? "reported" : "resolved"} successfully. Order ID: ${orderId}. Category: ${category}. Status: ${status}.`,
      html: htmlContent,
    };

    try {
      const ans = await auth_.sendMail(receiver);
      if (ans) {
        return { message: "Email sent" };
      }
    } catch (error) {
      console.error("Error while sending email:", error);
      return { message: "Email not sent" };
    }
  }
}


interface EventDetails {
  userAgent: string;
  ip: string;
  referer: string;
  language: string;
  cookies: string;
  time: string;
}

async function sendLoginWithNewDeviceAlert(email: string, eventName: string, eventDetails: EventDetails) {
  if (!email || !eventName) {
    throw new Error('Invalid email or event name');
  }

  const subject = `Event Notification: ${eventName}`;
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #4CAF50;">Event Notification</h2>
          <p style="font-size: 16px;">Dear User,</p>
          <p style="font-size: 14px;">An event has been recorded for your account.</p>
          <p style="font-size: 14px;"><strong>Event:</strong> ${eventName}</p>
          <p style="font-size: 14px;"><strong>Time:</strong> ${eventDetails.time}</p>
          <hr>
          <h3>Event Details</h3>
          <p style="font-size: 14px;"><strong>User Agent:</strong> ${eventDetails.userAgent}</p>
          <p style="font-size: 14px;"><strong>IP Address:</strong> ${eventDetails.ip}</p>
          <p style="font-size: 14px;"><strong>Referer:</strong> ${eventDetails.referer}</p>
          <p style="font-size: 14px;"><strong>Language:</strong> ${eventDetails.language}</p>
          <p style="font-size: 14px;"><strong>Cookies:</strong> ${eventDetails.cookies}</p>
          <br>
          <p>If this wasn't you, please contact support.</p>
          <br>
          <p>Best Regards,</p>
          <p><strong>Gaurav Bhatt</strong></p>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject,
    text: `An event has been recorded for your account. Event: ${eventName}. Time: ${eventDetails.time}.`,
    html: htmlContent,
  };

  try {
    await auth_.sendMail(mailOptions);
    return { message: 'Email sent' };
  } catch (error) {
    console.error('Error while sending email:', error);
    throw new Error('Email not sent');
  }
}

export { sendUserEvent, sendOtpEmail , sendOrderEvent ,sendProblemEvent , sendLoginWithNewDeviceAlert};

