import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendLoginWithNewDeviceAlert } from '../services/rotue';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }
        
        // Find user in database
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user ) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        if(!user.isVerified){
            return NextResponse.json({ message: 'User not verified' }, { status: 401 });
        }
        
        // Compare passwords
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // Set cookie
        const response = NextResponse.json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email, role: user.role , phone: user.phone }
        });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600, // 1 hour in seconds
        });

        const userAgent: string = req.headers.get("user-agent") || "Unknown";
        const ip: string = req.headers.get("x-forwarded-for") || req.ip || "Unknown IP";
        const referer: string = req.headers.get("referer") || "Direct Access";
        const language: string = req.headers.get("accept-language") || "Unknown";
        const cookies: string = req.headers.get("cookie") || "No Cookies";
        const time: string = new Date().toISOString();
    
        // Response object

        interface EventDetails {
            userAgent: string;
            ip: string;
            referer: string;
            language: string;
            cookies: string;
            time: string;
          }
        const responseData:EventDetails = {
            userAgent,
            ip,
            referer,
            language,
            cookies,
            time
        };

        // console.log("User logged in", responseData);
        await sendLoginWithNewDeviceAlert(email , "new device login alert" , responseData);
    
        
        return response;
    } catch (error) {
        console.error('Error during sign-in:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
