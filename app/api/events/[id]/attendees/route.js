// TOPIC: API routes and route handlers - Get event attendees (organiser only)
import { NextResponse } from 'next/server';
import { getEventById, getRegistrationsByEventId, getUsers } from '@/lib/data';
import { getSession } from '@/lib/auth';

// GET /api/events/[id]/attendees - Get list of attendees for an event
export async function GET(request, { params }) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (session.role !== 'organiser') {
      return NextResponse.json(
        { error: 'Only organisers can view attendee lists' },
        { status: 403 }
      );
    }

    const { id: eventId } = await params;
    const event = getEventById(eventId);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user owns this event
    if (event.organiserId !== session.userId) {
      return NextResponse.json(
        { error: 'You can only view attendees for your own events' },
        { status: 403 }
      );
    }

    // Get registrations and user data
    const registrations = getRegistrationsByEventId(eventId);
    const users = getUsers();

    const attendees = registrations.map(registration => {
      const user = users.find(u => u.id === registration.userId);
      return {
        id: registration.id,
        registeredAt: registration.createdAt,
        user: user ? {
          id: user.id,
          name: user.name,
          email: user.email,
        } : null,
      };
    });

    return NextResponse.json({ 
      attendees,
      total: attendees.length,
    });
  } catch (error) {
    console.error('Get attendees error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendees' },
      { status: 500 }
    );
  }
}
