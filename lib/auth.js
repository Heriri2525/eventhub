// TOPIC: Middleware and authentication - Authentication utilities using jose for JWT
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from './constants';

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'fallback-secret-key-for-development-only'
);

// Create a session token
export async function createSession(user) {
  const token = await new SignJWT({ 
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);

  return token;
}

// Verify and decode a session token
export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
}

// Get the current session from cookies (server-side only)
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return await verifySession(token);
}

// Set session cookie (server-side only)
export async function setSessionCookie(token) {
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

// Delete session cookie (server-side only)
export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Simple password hashing simulation (in production, use bcrypt or argon2)
export function hashPassword(password) {
  // This is a placeholder. In a real app, use bcrypt or argon2
  // For demo purposes, we'll just prepend a salt
  return `$2a$10$${Buffer.from(password).toString('base64')}`;
}

export function verifyPassword(password, hash) {
  // This is a placeholder matching the hashPassword above
  const expectedHash = hashPassword(password);
  return hash === expectedHash;
}

// Helper to check if user has required role
export function hasRole(user, requiredRole) {
  if (!user) return false;
  
  const roleHierarchy = {
    guest: 0,
    user: 1,
    organiser: 2,
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}
