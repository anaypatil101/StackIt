
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { DecodedUser } from '@/lib/types';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export async function GET(req: NextRequest) {
    try {
        const token = cookies().get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as DecodedUser;

        // In a real app, you might want to re-fetch the user from the DB to ensure they still exist
        // For this app, the JWT payload is sufficient.
        const user = {
            _id: decoded.id,
            name: decoded.name,
            avatarUrl: decoded.avatarUrl,
        };

        return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        console.error('Authentication check error:', error);
        // This will happen if the token is invalid or expired
        return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
}
