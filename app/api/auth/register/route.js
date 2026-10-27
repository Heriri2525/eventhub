// TOPIC: API routes and route handlers - User registration endpoint
import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/data';
import { hashPassword, createSession, setSessionCookie } from '@/lib/auth';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role = 'user' } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Validate role
    if (!['user', 'organiser'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Create user
    const passwordHash = hashPassword(password);
    const newUser = createUser({
      name,
      email,
      passwordHash,
      role,
    });

    // Create session
    const token = await createSession(newUser);
    await setSessionCookie(token);

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { 
        message: 'Registration successful',
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
