'use client';

// TOPIC: Data fetching with React Query - User registrations page
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { EventCard } from '@/components/EventCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Link from 'next/link';
import { Button } from '@/components/Button';

export default function MyRegistrationsPage() {
  const { user } = useAuth();

  // Fetch user's registered events
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    },
  });

  // For demo purposes, we'll filter events the user is registered for
  // In a real app, you'd have a dedicated API endpoint for this
  const registeredEvents = eventsData?.events?.filter(event => {
    // This is a simplified check - in production, fetch actual registrations
    return event.attendeeCount > 0; // Placeholder logic
  }) || [];

  if (eventsLoading) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
        <LoadingSpinner message="Loading your registrations..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
      <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>My Registrations</h1>

      {registeredEvents.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--spacing-2xl)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}>
          <h2 style={{ marginBottom: 'var(--spacing-md)' }}>No Registrations Yet</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
            You haven't registered for any events. Browse our events to find something you're interested in!
          </p>
          <Link href="/events">
            <Button variant="primary" size="large">
              Browse Events
            </Button>
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--spacing-xl)',
        }}>
          {registeredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
