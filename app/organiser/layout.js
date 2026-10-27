// TOPIC: Layouts and rendering strategies - Nested layout for organiser section
import Link from 'next/link';

export const metadata = {
  title: 'Organiser Dashboard',
};

export default function OrganiserLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        padding: 'var(--spacing-xl)',
      }}>
        <h2 style={{ marginBottom: 'var(--spacing-xl)', fontSize: 'var(--font-size-lg)' }}>
          Organiser Panel
        </h2>
        <nav>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <li>
              <Link href="/organiser/dashboard" style={{ color: 'var(--color-text-primary)' }}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/organiser/events/new" style={{ color: 'var(--color-text-primary)' }}>
                Create Event
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Main content */}
      <main style={{ flex: 1, padding: 'var(--spacing-2xl)' }}>
        {children}
      </main>
    </div>
  );
}
