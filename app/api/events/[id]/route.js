// TOPIC: API routes and route handlers - Individual event CRUD endpoints
import { NextResponse } from 'next/server';
import { getEventWithAttendeeCount, updateEvent, deleteEvent } from '@/lib/data';
import { getSession } from '@/lib/auth';

// GET /api/events/[id] - Get a single event
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const event = getEventWithAttendeeCount(id);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update an event (organiser only, own events)
export async function PUT(request, { params }) {
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
        { error: 'Only organisers can update events' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const event = getEventWithAttendeeCount(id);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user owns this event
    if (event.organiserId !== session.userId) {
      return NextResponse.json(
        { error: 'You can only update your own events' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updates = {};

    // Only update provided fields
    const allowedFields = [
      'title',
      'description',
      'category',
      'date',
      'time',
      'location',
      'image',
      'price',
      'capacity',
      'featured',
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    });

    // Validation for numeric fields
    if (updates.price !== undefined && updates.price < 0) {
      return NextResponse.json(
        { error: 'Price cannot be negative' },
        { status: 400 }
      );
    }

    if (updates.capacity !== undefined && updates.capacity < 1) {
      return NextResponse.json(
        { error: 'Capacity must be at least 1' },
        { status: 400 }
      );
    }

    const updatedEvent = updateEvent(id, updates);

    return NextResponse.json({
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete an event (organiser only, own events)
export async function DELETE(request, { params }) {
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
        { error: 'Only organisers can delete events' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const event = getEventWithAttendeeCount(id);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user owns this event
    if (event.organiserId !== session.userId) {
      return NextResponse.json(
        { error: 'You can only delete your own events' },
        { status: 403 }
      );
    }

    const success = deleteEvent(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
