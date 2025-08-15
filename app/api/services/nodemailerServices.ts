import nodemailer from 'nodemailer';
import { User, Order, Product, ReportedProblem } from '@prisma/client';

const auth_ = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Types including relations
interface OrderWithRelations extends Order {
  User: User;
  Product: Product;
}

interface ReportedProblemWithRelations extends ReportedProblem {
  User: User;
}

// ----------------- USER EVENTS -----------------
async function sendUserEvent(user: User, eventName: string) {
  const customer = user.email;
  const name = user.name;
  if (!customer || !name) return { message: "Invalid user details" };

  let subject = '';
  let htmlContent = '';
  let textContent = '';

  if (eventName === "user.created") {
    subject = "Welcome to the family";
    htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #4CAF50;">Welcome to Our Family, ${name}!</h2>
            <p>Thank you for registering with us. Your journey starts now!</p>
            <br>
            <a href="https://oc.golu.codes" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Continue Shopping</a>
            <br><br>
            <p>Best Regards,</p>
            <p><strong>Gaurav Bhatt</strong></p>
          </div>
        </body>
      </html>`;
    textContent = `Welcome ${name}! Thank you for registering with us.`;
  } else if (eventName === "user.passwordReset") {
    subject = "Password Reset Successfully";
    htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #4CAF50;">Your Password Has Been Reset Successfully</h2>
            <p>Dear ${name},</p>
            <p>Your password has been reset successfully. You can now log in using your new password.</p>
            <br>
            <a href="https://oc.golu.codes/login" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Login Now</a>
            <br><br>
            <p>If you did not reset your password, please contact support immediately.</p>
            <p>Best Regards,</p>
            <p><strong>Gaurav Bhatt</strong></p>
          </div>
        </body>
      </html>`;
    textContent = `Dear ${name}, your password has been reset successfully. If this wasn't you, please contact support immediately.`;
  }

  try {
    const ans = await auth_.sendMail({
      from: process.env.EMAIL,
      to: customer,
      subject,
      text: textContent,
      html: htmlContent,
    });
    return ans ? { message: "Email sent" } : { message: "Email not sent" };
  } catch (error) {
    console.error("Error while sending email:", error);
    return { message: "Email not sent" };
  }
}

// ----------------- ORDER EVENTS -----------------
async function sendOrderEvent(order: OrderWithRelations, eventName: string) {
  const customer = order.User.email;
  const name = order.User.name;
  if (!customer || !name) return { message: "Invalid order details" };

  if (eventName === "order.placed") {
    const productName = order.Product?.name || "Unknown Product";
    const productDescription = order.Product?.description || "No description available";
    const productQuantity = order.quantity || 1;

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #4CAF50;">Your Order Has Been Placed Successfully!</h2>
            <p>Dear ${name},</p>
            <p>Order ID: <strong>${order.id}</strong></p>
            <p>Total Amount: <strong>₹${order.totalAmount}</strong></p>
            <p>Delivery Address: ${order.deliveryAddress || "Not Provided"}</p>
            <p>Estimated Delivery: ${order.deliveryDate ? order.deliveryDate.toDateString() : "TBD"}</p>
            <hr>
            <h3>Product Details</h3>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Description:</strong> ${productDescription}</p>
            <p><strong>Quantity:</strong> ${productQuantity}</p>
            <br>
            <a href="https://oc.golu.codes/orders/${order.id}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Track Order</a>
            <br><br>
            <p>Best Regards,</p>
            <p><strong>Gaurav Bhatt</strong></p>
          </div>
        </body>
      </html>`;
    const textContent = `Your order has been placed successfully. Order ID: ${order.id}. Total Amount: ₹${order.totalAmount}. Product: ${productName} (Quantity: ${productQuantity}).`;

    try {
      const ans = await auth_.sendMail({
        from: process.env.EMAIL,
        to: customer,
        subject: "Order Placed Successfully",
        text: textContent,
        html: htmlContent,
      });
      return ans ? { message: "Email sent" } : { message: "Email not sent" };
    } catch (error) {
      console.error("Error while sending email:", error);
      return { message: "Email not sent" };
    }
  }
}

// ----------------- OTP EMAIL -----------------
async function sendOtpEmail(email: string, name: string, otp: string) {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #E53935;">Your OTP Code</h2>
          <p>Dear ${name},</p>
          <p>Your OTP code is: <strong>${otp}</strong></p>
          <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
          <br>
          <p>Best Regards,</p>
          <p><strong>Gaurav Bhatt</strong></p>
        </div>
      </body>
    </html>`;

  try {
    const ans = await auth_.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. Valid for 10 minutes.`,
      html: htmlContent,
    });
    return ans ? { message: "Email sent" } : { message: "Email not sent" };
  } catch (error) {
    console.error("Error while sending email:", error);
    return { message: "Email not sent" };
  }
}

// ----------------- PROBLEM EVENTS -----------------
async function sendProblemEvent(problem: ReportedProblemWithRelations, eventName: string) {
  const customer = problem.User.email;
  const name = problem.User.name;
  const orderId = problem.orderId;
  const category = problem.category;
  const description = problem.description;
  const status = problem.status;

  if (!customer || !name || !orderId) return { message: "Invalid problem details" };

  const subject = eventName === "problem.reported" ? "Issue Reported for Your Order" : "Issue Resolved for Your Order";

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: ${eventName === "problem.reported" ? "#FF5722" : "#4CAF50"};">${subject}</h2>
          <p>Dear ${name}, your issue regarding order <strong>${orderId}</strong> has been ${eventName === "problem.reported" ? "reported" : "resolved"}.</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Status:</strong> ${status}</p>
          <br>
          <a href="https://oc.golu.codes/orders/${orderId}/issues" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: ${eventName === "problem.reported" ? "#FF5722" : "#4CAF50"}; text-decoration: none; border-radius: 5px;">View Issue</a>
          <br><br>
          <p>We will update you on further progress.</p>
          <p>Best Regards,</p>
          <p><strong>Gaurav Bhatt</strong></p>
        </div>
      </body>
    </html>`;

  const textContent = `Your issue has been ${eventName === "problem.reported" ? "reported" : "resolved"} for order ${orderId}. Category: ${category}. Status: ${status}.`;

  try {
    const ans = await auth_.sendMail({
      from: process.env.EMAIL,
      to: customer,
      subject,
      text: textContent,
      html: htmlContent,
    });
    return ans ? { message: "Email sent" } : { message: "Email not sent" };
  } catch (error) {
    console.error("Error while sending email:", error);
    return { message: "Email not sent" };
  }
}

// ----------------- LOGIN EVENT -----------------
interface EventDetails {
  userAgent: string;
  ip: string;
  referer: string;
  language: string;
  cookies: string;
  time: string;
}

async function sendLoginWithNewDeviceAlert(email: string, eventName: string, eventDetails: EventDetails) {
  if (!email || !eventName) throw new Error('Invalid email or event name');

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #4CAF50;">Event Notification</h2>
          <p>An event has been recorded for your account.</p>
          <p><strong>Event:</strong> ${eventName}</p>
          <p><strong>Time:</strong> ${eventDetails.time}</p>
          <hr>
          <h3>Event Details</h3>
          <p><strong>User Agent:</strong> ${eventDetails.userAgent}</p>
          <p><strong>IP Address:</strong> ${eventDetails.ip}</p>
          <p><strong>Referer:</strong> ${eventDetails.referer}</p>
          <p><strong>Language:</strong> ${eventDetails.language}</p>
          <p><strong>Cookies:</strong> ${eventDetails.cookies}</p>
          <br>
          <p>If this wasn't you, please contact support.</p>
          <p>Best Regards,</p>
          <p><strong>Gaurav Bhatt</strong></p>
        </div>
      </body>
    </html>`;

  try {
    await auth_.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: `Event Notification: ${eventName}`,
      text: `An event has been recorded for your account. Event: ${eventName}. Time: ${eventDetails.time}.`,
      html: htmlContent,
    });
    return { message: "Email sent" };
  } catch (error) {
    console.error('Error while sending email:', error);
    throw new Error('Email not sent');
  }
}

// ----------------- EXPORT -----------------
export { sendUserEvent, sendOtpEmail, sendOrderEvent, sendProblemEvent, sendLoginWithNewDeviceAlert };