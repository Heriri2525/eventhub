'use client';

// TOPIC: Error boundary, performance, lazy loading - Error boundary for app
import { useEffect } from 'react';
import { Button } from '@/components/Button';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error);
  }, [error]);

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
        fontSize: 'var(--font-size-4xl)',
        marginBottom: 'var(--spacing-md)',
        color: 'var(--color-error)',
      }}>
        Something went wrong!
      </h1>
      <p style={{
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--spacing-xl)',
        maxWidth: '500px',
      }}>
        We're sorry, but something unexpected happened. Please try again.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <pre style={{
          textAlign: 'left',
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-lg)',
          overflow: 'auto',
          maxWidth: '600px',
          fontSize: 'var(--font-size-sm)',
        }}>
          {error.message}
        </pre>
      )}
      <Button variant="primary" size="large" onClick={() => reset()}>
        Try Again
      </Button>
    </div>
  );
}
