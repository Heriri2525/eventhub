// TOPIC: Error boundary, performance, lazy loading - Memoized EventCard component
import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/EventCard.module.css';

// TOPIC: Props and rendering patterns - Reusable event card component
function EventCardComponent({ event, compact = false }) {
  const { 
    id, 
    title, 
    description, 
    category, 
    date, 
    time, 
    location, 
    image, 
    price, 
    attendeeCount = 0,
    capacity,
    featured 
  } = event;

  // Format date
  const eventDate = new Date(date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  // TOPIC: Props and rendering patterns - Conditional rendering
  const isFree = price === 0;
  const isFull = attendeeCount >= capacity;

  return (
    <Link href={`/events/${id}`} className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <div className={styles.imageContainer}>
        {/* TOPIC: Optimisation and environment - next/image for optimization */}
        <Image
          src={image}
          alt={title}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {featured && <span className={styles.badge}>Featured</span>}
      </div>
      
      <div className={styles.content}>
        <span className={styles.category}>{category}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <svg className={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate} at {time}</span>
          </div>
          
          <div className={styles.metaItem}>
            <svg className={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{location.name}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.footer}>
        <span className={`${styles.price} ${isFree ? styles.priceFree : ''}`}>
          {isFree ? 'Free' : `${price.toFixed(2)} ETB`}
        </span>
        <span className={styles.attendees}>
          {attendeeCount} / {capacity} tickets
          {isFull && ' (Full)'}
        </span>
      </div>
    </Link>
  );
}

// TOPIC: Error boundary, performance, lazy loading - React.memo for performance
export const EventCard = memo(EventCardComponent);
