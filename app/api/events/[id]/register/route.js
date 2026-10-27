// TOPIC: API routes and route handlers - Event registration endpoints
import { NextResponse } from 'next/server';
import { 
  getEventById, 
  getRegistration, 
  createRegistration, 
  deleteRegistration,
  getRegistrationsByEventId 
} from '@/lib/data';
import { getSession } from '@/lib/auth';

// POST /api/events/[id]/register - Register for an event
export async function POST(request, { params }) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
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

    // Check if already registered
    const existing = getRegistration(session.userId, eventId);
    if (existing) {
      return NextResponse.json(
        { error: 'Already registered for this event' },
        { status: 409 }
      );
    }

    // Check capacity
    const registrations = getRegistrationsByEventId(eventId);
    if (registrations.length >= event.capacity) {
      return NextResponse.json(
        { error: 'Event is full' },
        { status: 400 }
      );
    }

    const registration = createRegistration(session.userId, eventId);

    return NextResponse.json(
      { 
        message: 'Successfully registered for event',
        registration 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register for event error:', error);
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id]/register - Unregister from an event
export async function DELETE(request, { params }) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
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

    // Check if registered
    const existing = getRegistration(session.userId, eventId);
    if (!existing) {
      return NextResponse.json(
        { error: 'Not registered for this event' },
        { status: 400 }
      );
    }

    const success = deleteRegistration(session.userId, eventId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to unregister' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Successfully unregistered from event',
    });
  } catch (error) {
    console.error('Unregister from event error:', error);
    return NextResponse.json(
      { error: 'Failed to unregister from event' },
      { status: 500 }
    );
  }
}
