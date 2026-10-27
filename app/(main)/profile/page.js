'use client';

// TOPIC: Forms and controlled components - Profile management page
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--spacing-2xl) 0', maxWidth: '600px' }}>
      <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Profile</h1>

      <div style={{
        backgroundColor: 'var(--color-surface)',
        padding: 'var(--spacing-xl)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
            Name
          </label>
          <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600' }}>{user.name}</p>
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
            Email
          </label>
          <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600' }}>{user.email}</p>
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
            Role
          </label>
          <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', textTransform: 'capitalize' }}>
            {user.role}
          </p>
        </div>

        <div style={{
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-background-secondary)',
          borderRadius: 'var(--radius-md)',
          marginTop: 'var(--spacing-xl)',
        }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Profile editing is not available in this demo version.
          </p>
        </div>
      </div>
    </div>
  );
}
