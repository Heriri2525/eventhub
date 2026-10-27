// TOPIC: API routes and route handlers - User logout endpoint
import { NextResponse } from 'next/server';
import { deleteSessionCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    await deleteSessionCookie();

    return NextResponse.json({
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
