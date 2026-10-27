// TOPIC: API routes and route handlers - External API proxy (Ticketmaster)
// This proxies requests to the Ticketmaster API server-side to keep the API key secure
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const apiKey = process.env.TICKETMASTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Ticketmaster API key not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || 'music';
    const size = searchParams.get('size') || '10';

    // TOPIC: Optimisation and environment - Server-side API proxy to protect API keys
    // The API key is never exposed to the browser
    const ticketmasterUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&keyword=${encodeURIComponent(keyword)}&size=${size}`;

    const response = await fetch(ticketmasterUrl);

    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform Ticketmaster events to our format
    const transformedEvents = data._embedded?.events?.map(event => ({
      id: event.id,
      title: event.name,
      description: event.info || event.pleaseNote || 'No description available',
      category: event.classifications?.[0]?.segment?.name || 'Other',
      date: event.dates?.start?.localDate || '',
      time: event.dates?.start?.localTime || '00:00',
      location: {
        name: event._embedded?.venues?.[0]?.name || 'TBD',
        lat: parseFloat(event._embedded?.venues?.[0]?.location?.latitude) || 0,
        lng: parseFloat(event._embedded?.venues?.[0]?.location?.longitude) || 0,
      },
      image: event.images?.[0]?.url || '',
      price: event.priceRanges?.[0]?.min || 0,
      url: event.url,
      source: 'ticketmaster',
    })) || [];

    return NextResponse.json({ 
      events: transformedEvents,
      total: data.page?.totalElements || 0,
    });
  } catch (error) {
    console.error('External API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external events', details: error.message },
      { status: 500 }
    );
  }
}
