
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        cookies().set('token', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/',
        });
        return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
