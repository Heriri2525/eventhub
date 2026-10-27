'use client';

// TOPIC: Data fetching with React Query - Event detail page with mutations
// TOPIC: Layouts and rendering strategies - SSR-like data fetching with React Query
// TOPIC: Error boundary, performance, lazy loading - Dynamic import for maps
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Modal } from '@/components/Modal';
import { PaymentModal } from '@/components/PaymentModal';

// TOPIC: Error boundary, performance, lazy loading - Lazy load map component
const EventMap = dynamic(() => import('@/components/EventMap').then(mod => mod.EventMap), {
  loading: () => <LoadingSpinner message="Loading map..." />,
  ssr: false,
});

export default function EventDetailPage({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // TOPIC: Data fetching with React Query - useQuery for fetching event
  const { data, error, isLoading } = useQuery({
    queryKey: ['event', unwrappedParams.id],
    queryFn: async () => {
      const res = await fetch(`/api/events/${unwrappedParams.id}`);
      if (!res.ok) throw new Error('Failed to fetch event');
      return res.json();
    },
  });

  // Check if user is registered
  const { data: registrationData } = useQuery({
    queryKey: ['registration', unwrappedParams.id],
    queryFn: async () => {
      if (!isAuthenticated) return { isRegistered: false };
      const res = await fetch(`/api/events/${unwrappedParams.id}/register`);
      return { isRegistered: res.ok };
    },
    enabled: isAuthenticated,
  });

  // TOPIC: Data fetching with React Query - useMutation for registration
  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/events/${unwrappedParams.id}/register`, {
        method: 'POST',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
      return res.json();
    },
    onSuccess: () => {
      // TOPIC: Data fetching with React Query - Cache invalidation
      queryClient.invalidateQueries(['event', unwrappedParams.id]);
      queryClient.invalidateQueries(['registration', unwrappedParams.id]);
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/events/${unwrappedParams.id}/register`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['event', unwrappedParams.id]);
      queryClient.invalidateQueries(['registration', unwrappedParams.id]);
    },
  });

  // TOPIC: Side effects (useEffect) - Update document title
  useEffect(() => {
    if (data?.event) {
      document.title = `${data.event.title} | EventHub`;
    }
    return () => {
      document.title = 'EventHub';
    };
  }, [data]);

  const handleRegisterClick = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (registrationData?.isRegistered) {
      unregisterMutation.mutate();
      return;
    }

    // Check if event is paid
    if (data.event.price > 0) {
      // Show payment modal
      setShowPaymentModal(true);
    } else {
      // Free event - register directly
      registerMutation.mutate();
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    queryClient.invalidateQueries(['event', unwrappedParams.id]);
    queryClient.invalidateQueries(['registration', unwrappedParams.id]);
  };

  // TOPIC: Maps, real-time and data formats - ICS calendar download
  const downloadICS = () => {
    const event = data.event;
    const startDate = new Date(`${event.date}T${event.time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EventHub//EventHub//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@eventhub.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${event.location.name}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]/gi, '-')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
        <LoadingSpinner message="Loading event..." />
      </div>
    );
  }

  if (error || !data?.event) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-2xl) 0', textAlign: 'center' }}>
        <h2>Event not found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
          {error?.message || 'This event does not exist.'}
        </p>
        <Button 
          variant="primary" 
          style={{ marginTop: 'var(--spacing-lg)' }}
          onClick={() => router.push('/events')}
        >
          Back to Events
        </Button>
      </div>
    );
  }

  const event = data.event;
  const eventDate = new Date(event.date);
  const isRegistered = registrationData?.isRegistered;
  const isFull = event.attendeeCount >= event.capacity;
  const isOwner = user?.id === event.organiserId;

  return (
    <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
      <Link href="/events" style={{ display: 'inline-block', marginBottom: 'var(--spacing-lg)' }}>
        ← Back to Events
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'var(--spacing-2xl)',
      }}>
        {/* Event Image */}
        <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <Image
            src={event.image}
            alt={event.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          {event.featured && (
            <div style={{
              position: 'absolute',
              top: 'var(--spacing-lg)',
              right: 'var(--spacing-lg)',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600',
            }}>
              Featured
            </div>
          )}
        </div>

        {/* Event Details */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-lg)' }}>
            <div>
              <span style={{
                display: 'inline-block',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                padding: 'var(--spacing-xs) var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-md)',
              }}>
                {event.category}
              </span>
              <h1 style={{ marginBottom: 'var(--spacing-md)' }}>{event.title}</h1>
              <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>
                {event.description}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: 'var(--color-primary)' }}>
                {event.price === 0 ? 'Free' : `${event.price.toFixed(2)} ETB`}
              </div>
            </div>
          </div>

          {/* Event Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-lg)',
            padding: 'var(--spacing-xl)',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            marginBottom: 'var(--spacing-xl)',
          }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                📅 Date & Time
              </div>
              <div style={{ fontWeight: '600' }}>
                {eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div>{event.time}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                📍 Location
              </div>
              <div style={{ fontWeight: '600' }}>{event.location.name}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                👥 Attendees
              </div>
              <div style={{ fontWeight: '600' }}>
                {event.attendeeCount} / {event.capacity}
                {isFull && <span style={{ color: 'var(--color-error)', marginLeft: 'var(--spacing-xs)' }}>(Full)</span>}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
            {!isOwner && (
              <Button
                variant={isRegistered ? 'outline' : 'primary'}
                size="large"
                onClick={handleRegisterClick}
                disabled={(!isRegistered && isFull) || registerMutation.isPending || unregisterMutation.isPending}
                loading={registerMutation.isPending || unregisterMutation.isPending}
              >
                {isRegistered 
                  ? 'Unregister' 
                  : isFull 
                  ? 'Event Full' 
                  : event.price > 0 
                  ? `Get Ticket - ${event.price.toFixed(2)} ETB`
                  : 'Get Free Ticket'}
              </Button>
            )}
            {isRegistered && (
              <Button variant="outline" size="large" onClick={downloadICS}>
                📅 Add to Calendar
              </Button>
            )}
            {isOwner && (
              <>
                <Button 
                  variant="outline" 
                  size="large"
                  onClick={() => router.push(`/organiser/events/${event.id}/edit`)}
                >
                  Edit Event
                </Button>
                <Button 
                  variant="outline" 
                  size="large"
                  onClick={() => router.push(`/organiser/events/${event.id}/attendees`)}
                >
                  View Attendees
                </Button>
              </>
            )}
          </div>

          {/* Map */}
          <div style={{ marginTop: 'var(--spacing-xl)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Location</h3>
            <EventMap event={event} height="400px" />
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login Required"
      >
        <p style={{ marginBottom: 'var(--spacing-lg)' }}>
          Please login to register for events.
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <Button 
            variant="primary" 
            fullWidth
            onClick={() => router.push(`/login?redirect=/events/${unwrappedParams.id}`)}
          >
            Login
          </Button>
          <Button 
            variant="outline" 
            fullWidth
            onClick={() => router.push('/register')}
          >
            Sign Up
          </Button>
        </div>
      </Modal>

      {/* Payment Modal */}
      {data?.event && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          event={data.event}
          user={user}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
