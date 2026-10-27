// Payment callback webhook from Chapa
import { NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/chapa';
import { createRegistration } from '@/lib/data';

export async function POST(request) {
  try {
    const body = await request.json();
    const { tx_ref } = body;

    if (!tx_ref) {
      return NextResponse.json(
        { error: 'Transaction reference is required' },
        { status: 400 }
      );
    }

    // Verify payment with Chapa
    const verification = await verifyPayment(tx_ref);

    if (verification.status === 'success' && verification.data.status === 'success') {
      // Extract eventId and userId from tx_ref
      // Format: EVT-{eventId}-{userId}-{timestamp}
      const parts = tx_ref.split('-');
      const eventId = parts[1];
      const userId = parts[2];

      // Create registration
      createRegistration(userId, eventId);

      return NextResponse.json({
        message: 'Payment verified and registration completed',
        status: 'success',
      });
    } else {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}
