'use client';

// TOPIC: Data fetching with SWR - Events list with search and filtering
// TOPIC: Layouts and rendering strategies - Client component using SWR for data fetching
import { useState, useMemo } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useDebounce } from '@/hooks/useDebounce';
import { useEventFilters } from '@/hooks/useEventFilters';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import styles from '@/styles/Form.module.css';

// TOPIC: Data fetching with SWR - Custom fetcher function
const fetcher = (url) => fetch(url).then(res => res.json());

export default function EventsPage() {
  // TOPIC: Hooks deep dive - Custom hooks usage
  const { filters, actions, activeFilterCount } = useEventFilters();
  const [searchInput, setSearchInput] = useState('');
  
  // TOPIC: Hooks deep dive (useDebounce) - Debounce search input
  const debouncedSearch = useDebounce(searchInput, 500);

  // TOPIC: Data fetching with SWR - Fetch events with revalidation
  const { data, error, isLoading, mutate } = useSWR(
    '/api/events',
    fetcher,
    {
      // TOPIC: Layouts and rendering strategies - ISR-like behavior with revalidateOnMount
      revalidateOnMount: true,
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  // TOPIC: Hooks deep dive (useMemo) - Filter and paginate events
  const filteredEvents = useMemo(() => {
    if (!data?.events) return [];

    let filtered = [...data.events];

    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    // Apply price filter
    if (filters.priceRange === 'free') {
      filtered = filtered.filter(event => event.price === 0);
    } else if (filters.priceRange === 'paid') {
      filtered = filtered.filter(event => event.price > 0);
    }

    // Apply date filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const eventDate = (event) => new Date(event.date);

      if (filters.dateRange === 'today') {
        filtered = filtered.filter(event => {
          const date = eventDate(event);
          return date.toDateString() === now.toDateString();
        });
      } else if (filters.dateRange === 'week') {
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(event => {
          const date = eventDate(event);
          return date >= now && date <= weekFromNow;
        });
      } else if (filters.dateRange === 'month') {
        const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(event => {
          const date = eventDate(event);
          return date >= now && date <= monthFromNow;
        });
      }
    }

    return filtered;
  }, [data, debouncedSearch, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (filters.page - 1) * ITEMS_PER_PAGE,
    filters.page * ITEMS_PER_PAGE
  );

  // TOPIC: Props and rendering patterns - Conditional rendering based on state
  if (error) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-2xl) 0', textAlign: 'center' }}>
        <h2>Failed to load events</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
          {error.message}
        </p>
        <Button onClick={() => mutate()} variant="primary" style={{ marginTop: 'var(--spacing-lg)' }}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
      <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>All Events</h1>

      {/* Filters */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        padding: 'var(--spacing-lg)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--spacing-xl)',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)',
        }}>
          {/* Search */}
          <div className={styles.formGroup}>
            <label htmlFor="search" className={styles.label}>Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search events..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Category */}
          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>Category</label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => actions.setCategory(e.target.value)}
              className={styles.select}
            >
              <option value="all">All Categories</option>
              <option value="Music">Music</option>
              <option value="Technology">Technology</option>
              <option value="Arts">Arts</option>
              <option value="Business">Business</option>
              <option value="Sports">Sports</option>
              <option value="Food">Food</option>
            </select>
          </div>

          {/* Price */}
          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>Price</label>
            <select
              id="price"
              value={filters.priceRange}
              onChange={(e) => actions.setPriceRange(e.target.value)}
              className={styles.select}
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* Date Range */}
          <div className={styles.formGroup}>
            <label htmlFor="dateRange" className={styles.label}>Date</label>
            <select
              id="dateRange"
              value={filters.dateRange}
              onChange={(e) => actions.setDateRange(e.target.value)}
              className={styles.select}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
            </span>
            <Button variant="ghost" size="small" onClick={actions.resetFilters}>
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingSpinner message="Loading events..." />
      ) : (
        <>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Showing {paginatedEvents.length} of {filteredEvents.length} events
            </p>
          </div>

          {/* TOPIC: Props and rendering patterns - List rendering */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--spacing-xl)',
            marginBottom: 'var(--spacing-xl)',
          }}>
            {paginatedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {paginatedEvents.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
                No events found
              </p>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Try adjusting your filters
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--spacing-sm)',
              marginTop: 'var(--spacing-xl)',
            }}>
              <Button
                variant="outline"
                disabled={filters.page === 1}
                onClick={() => actions.setPage(filters.page - 1)}
              >
                Previous
              </Button>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 var(--spacing-md)',
              }}>
                Page {filters.page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={filters.page === totalPages}
                onClick={() => actions.setPage(filters.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
