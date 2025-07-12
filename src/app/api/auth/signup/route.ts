
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}


export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }
        
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
        }

        const avatarUrl = `https://placehold.co/40x40/9C27B0/FFFFFF.png?text=${name.charAt(0).toUpperCase()}`;

        const user = await UserModel.create({
            name,
            email,
            password,
            avatarUrl,
        });

        const tokenPayload = {
            id: user._id,
            name: user.name,
            avatarUrl: user.avatarUrl,
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, {
            expiresIn: '7d',
        });

        cookies().set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        // Return user data without the password
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
        };

        return NextResponse.json({ message: 'User created successfully', user: userResponse }, { status: 201 });

    } catch (error: any) {
        console.error('Signup error:', error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
