// TOPIC: Layouts and rendering strategies - SSG (Static Site Generation) for home page
// TOPIC: Server and client components - Server component that fetches data at build time
import Link from 'next/link';
import { getEventsWithAttendeeCounts, getCategories } from '@/lib/data';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/Button';

// TOPIC: Metadata and SEO - Page-specific metadata
export const metadata = {
  title: 'Home',
  description: 'Discover amazing events in your area. From music festivals to tech conferences.',
};

// This page uses SSG - data is fetched at build time
export default async function HomePage() {
  // TOPIC: Layouts and rendering strategies - Data fetching in server component
  const allEvents = getEventsWithAttendeeCounts();
  const categories = getCategories();
  
  // Get featured events
  const featuredEvents = allEvents.filter(event => event.featured).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        padding: 'var(--spacing-2xl) 0',
        textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            marginBottom: 'var(--spacing-lg)',
            color: 'white',
          }}>
            Discover Amazing Events
          </h1>
          <p style={{
            fontSize: 'var(--font-size-xl)',
            marginBottom: 'var(--spacing-xl)',
            maxWidth: '600px',
            margin: '0 auto var(--spacing-xl)',
            opacity: 0.9,
          }}>
            From music festivals to tech conferences, find your next experience on EventHub
          </p>
          <Link href="/events">
            <Button variant="secondary" size="large">
              Browse All Events
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Events Section */}
      <section style={{ padding: 'var(--spacing-2xl) 0' }}>
        <div className="container">
          <h2 style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
            Featured Events
          </h2>
          {/* TOPIC: Props and rendering patterns - List rendering with keys */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--spacing-xl)',
          }}>
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {featuredEvents.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No featured events at the moment.
            </p>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section style={{
        padding: 'var(--spacing-2xl) 0',
        backgroundColor: 'var(--color-background-secondary)',
      }}>
        <div className="container">
          <h2 style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
            Browse by Category
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'var(--spacing-lg)',
          }}>
            {/* TOPIC: Props and rendering patterns - List rendering with dynamic data */}
            {categories.map(category => {
              const categoryEvents = allEvents.filter(e => e.category === category);
              return (
                <Link
                  key={category}
                  href={`/events?category=${encodeURIComponent(category)}`}
                  style={{
                    padding: 'var(--spacing-xl)',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center',
                    textDecoration: 'none',
                    border: '1px solid var(--color-border)',
                    transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
                  }}
                  className="category-card"
                >
                  <div style={{
                    fontSize: '2rem',
                    marginBottom: 'var(--spacing-sm)',
                  }}>
                    {getCategoryIcon(category)}
                  </div>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-xs)' }}>
                    {category}
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    {categoryEvents.length} {categoryEvents.length === 1 ? 'event' : 'events'}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: 'var(--spacing-2xl) 0',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>
            Ready to host your own event?
          </h2>
          <p style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-xl)',
          }}>
            Create and manage events with ease on EventHub
          </p>
          <Link href="/register">
            <Button variant="primary" size="large">
              Get Started as an Organiser
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function getCategoryIcon(category) {
  const icons = {
    'Music': '🎵',
    'Technology': '💻',
    'Arts': '🎨',
    'Business': '💼',
    'Sports': '⚽',
    'Food': '🍔',
  };
  return icons[category] || '📅';
}
