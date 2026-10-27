'use client';

// Organiser attendees list page
import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function AttendeesPage({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();

  const { data: eventData, isLoading: eventLoading } = useQuery({
    queryKey: ['event', unwrappedParams.id],
    queryFn: async () => {
      const res = await fetch(`/api/events/${unwrappedParams.id}`);
      if (!res.ok) throw new Error('Failed to fetch event');
      return res.json();
    },
  });

  const { data: attendeesData, isLoading: attendeesLoading } = useQuery({
    queryKey: ['attendees', unwrappedParams.id],
    queryFn: async () => {
      const res = await fetch(`/api/events/${unwrappedParams.id}/attendees`);
      if (!res.ok) throw new Error('Failed to fetch attendees');
      return res.json();
    },
  });

  // Function to download CSV
  const downloadCSV = () => {
    if (!attendeesData?.attendees) return;

    const headers = ['Name', 'Email', 'Registered At'];
    const rows = attendeesData.attendees.map(attendee => [
      attendee.user.name,
      attendee.user.email,
      new Date(attendee.registeredAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventData.event.title.replace(/[^a-z0-9]/gi, '-')}-attendees.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (eventLoading || attendeesLoading) {
    return <LoadingSpinner message="Loading attendees..." />;
  }

  const event = eventData?.event;
  const attendees = attendeesData?.attendees || [];
  const totalTickets = attendees.length;
  const ticketRevenue = event.price * totalTickets;

  return (
    <div>
      <Button variant="ghost" onClick={() => router.back()} style={{ marginBottom: 'var(--spacing-lg)' }}>
        ← Back
      </Button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div>
          <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>Attendees</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>{event.title}</p>
        </div>
        <Button variant="primary" onClick={downloadCSV} disabled={attendees.length === 0}>
          📥 Download CSV
        </Button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-2xl)',
      }}>
        <div style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
            🎫 Total Tickets
          </div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '700', color: 'var(--color-primary)' }}>
            {totalTickets}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-xs)' }}>
            of {event.capacity} capacity
          </div>
        </div>

        <div style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
            💰 Ticket Revenue
          </div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '700', color: 'var(--color-success)' }}>
            {event.price === 0 ? 'Free' : `${ticketRevenue.toFixed(2)} ETB`}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-xs)' }}>
            {event.price.toFixed(2)} ETB per ticket
          </div>
        </div>

        <div style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
            📊 Capacity Used
          </div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '700', color: 'var(--color-secondary)' }}>
            {((totalTickets / event.capacity) * 100).toFixed(0)}%
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-xs)' }}>
            {event.capacity - totalTickets} tickets left
          </div>
        </div>
      </div>

      {/* Attendees List */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)' }}>Ticket Holders ({totalTickets})</h2>
        </div>

        {attendees.length === 0 ? (
          <div style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            No tickets sold yet
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                  <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontWeight: '600' }}>#</th>
                  <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontWeight: '600' }}>Registered At</th>
                  <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((attendee, index) => (
                  <tr key={attendee.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 'var(--spacing-md)' }}>{index + 1}</td>
                    <td style={{ padding: 'var(--spacing-md)', fontWeight: '500' }}>{attendee.user.name}</td>
                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>{attendee.user.email}</td>
                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
                      {new Date(attendee.registeredAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={{ padding: 'var(--spacing-md)' }}>
                      <span style={{
                        padding: 'var(--spacing-xs) var(--spacing-md)',
                        backgroundColor: 'var(--color-success)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: '600',
                      }}>
                        ✓ Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
