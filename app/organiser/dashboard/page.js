'use client';

// TOPIC: Data fetching with React Query - Organiser dashboard with stats
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EventCard } from '@/components/EventCard';

export default function OrganiserDashboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['organiser-events'],
    queryFn: async () => {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Failed to fetch events');
      const result = await res.json();
      // Filter events created by this organiser
      const myEvents = result.events.filter(e => e.organiserId === user.id);
      return { events: myEvents };
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const myEvents = data?.events || [];
  const totalEvents = myEvents.length;
  const totalAttendees = myEvents.reduce((sum, event) => sum + (event.attendeeCount || 0), 0);
  const upcomingEvents = myEvents.filter(e => new Date(e.date) >= new Date()).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h1>Dashboard</h1>
        <Link href="/organiser/events/new">
          <Button variant="primary">Create New Event</Button>
        </Link>
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
            Total Events
          </div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '700', color: 'var(--color-primary)' }}>
            {totalEvents}
          </div>
        </div>

        <div style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
            Total Attendees
          </div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '700', color: 'var(--color-success)' }}>
            {totalAttendees}
          </div>
        </div>

        <div style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
            Upcoming Events
          </div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '700', color: 'var(--color-secondary)' }}>
            {upcomingEvents}
          </div>
        </div>
      </div>

      {/* My Events */}
      <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>My Events</h2>
      {myEvents.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--spacing-2xl)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}>
          <p style={{ marginBottom: 'var(--spacing-lg)' }}>You haven't created any events yet.</p>
          <Link href="/organiser/events/new">
            <Button variant="primary">Create Your First Event</Button>
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--spacing-xl)',
        }}>
          {myEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
