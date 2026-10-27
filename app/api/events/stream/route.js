// TOPIC: Maps, real-time and data formats - Server-Sent Events (SSE) for real-time updates
import { getEventsWithAttendeeCounts } from '@/lib/data';

// Mark as dynamic since SSE is a streaming endpoint
export const dynamic = 'force-dynamic';

export async function GET(request) {
  // Set up SSE headers
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // Function to send SSE message
  const sendEvent = async (data) => {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    await writer.write(encoder.encode(message));
  };

  // Start streaming
  (async () => {
    try {
      // Send initial data
      const events = getEventsWithAttendeeCounts();
      await sendEvent({
        type: 'initial',
        events: events.map(e => ({
          id: e.id,
          attendeeCount: e.attendeeCount,
          capacity: e.capacity,
        })),
      });

      // Send updates every 5 seconds
      const interval = setInterval(async () => {
        try {
          const updatedEvents = getEventsWithAttendeeCounts();
          await sendEvent({
            type: 'update',
            timestamp: new Date().toISOString(),
            events: updatedEvents.map(e => ({
              id: e.id,
              attendeeCount: e.attendeeCount,
              capacity: e.capacity,
            })),
          });
        } catch (error) {
          console.error('SSE update error:', error);
        }
      }, 5000);

      // Clean up on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        writer.close();
      });
    } catch (error) {
      console.error('SSE stream error:', error);
      writer.close();
    }
  })();

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
