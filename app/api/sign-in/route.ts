import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        console.log(email  , password);
        
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
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600, // 1 hour in seconds
        });
        
        return response;
    } catch (error) {
        console.error('Error during sign-in:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
