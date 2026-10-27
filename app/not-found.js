// TOPIC: Error boundary, performance, lazy loading - Custom 404 page
import Link from 'next/link';
import { Button } from '@/components/Button';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      padding: 'var(--spacing-xl)',
    }}>
      <h1 style={{
        fontSize: 'clamp(3rem, 10vw, 6rem)',
        marginBottom: 'var(--spacing-md)',
        color: 'var(--color-primary)',
      }}>
        404
      </h1>
      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>
        Page Not Found
      </h2>
      <p style={{
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--spacing-xl)',
        maxWidth: '400px',
      }}>
        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link href="/">
        <Button variant="primary" size="large">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
}
