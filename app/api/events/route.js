// TOPIC: API routes and route handlers - Events CRUD endpoints
import { NextResponse } from 'next/server';
import { getEventsWithAttendeeCounts, createEvent } from '@/lib/data';
import { getSession } from '@/lib/auth';

// GET /api/events - List all events with attendee counts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let events = getEventsWithAttendeeCounts();

    // Filter by category
    if (category && category !== 'all') {
      events = events.filter(event => event.category === category);
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      events = events.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by featured
    if (featured === 'true') {
      events = events.filter(event => event.featured);
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event (organiser only)
export async function POST(request) {
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
        { error: 'Only organisers can create events' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      image,
      price,
      capacity,
      featured = false,
    } = body;

    // Validation
    if (!title || !description || !category || !date || !time || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!location.name || !location.lat || !location.lng) {
      return NextResponse.json(
        { error: 'Invalid location data' },
        { status: 400 }
      );
    }

    if (price < 0 || capacity < 1) {
      return NextResponse.json(
        { error: 'Invalid price or capacity' },
        { status: 400 }
      );
    }

    // Create event
    const newEvent = createEvent({
      title,
      description,
      category,
      date,
      time,
      location,
      image: image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
      price: parseFloat(price),
      capacity: parseInt(capacity),
      organiserId: session.userId,
      featured: Boolean(featured),
    });

    return NextResponse.json(
      { message: 'Event created successfully', event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
