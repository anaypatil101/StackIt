
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

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const user = await UserModel.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

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
        // const userResponse = {
        //     _id: user._id,
        //     name: user.name,
        //     email: user.email,
        //     avatarUrl: user.avatarUrl,
        // };
        
        return NextResponse.json({ message: 'Login successful', user: userResponse }, { status: 200 });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
