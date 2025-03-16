import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export async function GET(req: NextRequest) {
    try {
        // 🔒 Token extract from cookies
        const token = req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // ✅ Verify JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        } catch (error) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        // 📌 Fetch user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, name: true, role: true , phone: true }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
