import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(req: NextRequest) {
    try {
        // 🔒 Extract token from cookies
        const token = req.cookies.get('token')?.value;
        console.log('Token:', token || 'No Token');

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // ✅ Verify JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
        } catch (error) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        // 📌 Fetch user role from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { role: true }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // 🔍 Check if user is admin
        if (user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
        }

        return NextResponse.json({ message: 'Access granted', isAdmin: true }, { status: 200 });

    } catch (error) {
        console.error('Error checking admin role:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
