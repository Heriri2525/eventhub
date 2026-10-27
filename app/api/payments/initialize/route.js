// Payment initialization endpoint using Chapa
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getEventById } from '@/lib/data';
import { initializePayment } from '@/lib/chapa';

export async function POST(request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { eventId, firstName, lastName, email, phoneNumber } = await request.json();

    // Get event details
    const event = getEventById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // For all events (free or paid), users need to get a ticket
    // Free events are handled directly via registration endpoint
    // This endpoint is only for paid events
    if (event.price === 0) {
      return NextResponse.json(
        { error: 'This is a free event, no payment required' },
        { status: 400 }
      );
    }

    // Generate unique transaction reference
    const tx_ref = `EVT-${eventId}-${session.userId}-${Date.now()}`;

    // Initialize payment
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const paymentData = await initializePayment({
      amount: event.price,
      email: email || session.email,
      firstName: firstName || session.name.split(' ')[0] || 'User',
      lastName: lastName || session.name.split(' ').slice(1).join(' ') || 'EventHub',
      tx_ref,
      callback_url: `${siteUrl}/api/payments/callback`,
      return_url: `${siteUrl}/events/${eventId}?payment=success`,
    });

    return NextResponse.json({
      checkoutUrl: paymentData.data.checkout_url,
      tx_ref,
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
