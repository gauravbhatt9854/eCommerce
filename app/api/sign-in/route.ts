import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendLoginWithNewDeviceAlert } from '../services/nodemailerServices';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ message: 'User not verified' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set cookie + return response
    const response = NextResponse.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone }
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
    });

    // Collect event details for login alert
    const eventData = {
      userAgent: req.headers.get("user-agent") || "Unknown",
      ip: req.headers.get("x-forwarded-for") || "Unknown IP",
      referer: req.headers.get("referer") || "Direct Access",
      language: req.headers.get("accept-language") || "Unknown",
      cookies: req.headers.get("cookie") || "No Cookies",
      time: new Date().toISOString()
    };

    // Fire-and-forget email (no await → won't block response)
    sendLoginWithNewDeviceAlert(email, "new device login alert", eventData)
      .then((emailResult) => {
        console.log("Email Result:", emailResult.message);
      })
      .catch((err) => {
        console.error("Email send failed:", err);
      });

    return response;

  } catch (error) {
    console.error('Error during sign-in:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}