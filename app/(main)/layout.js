// TOPIC: Next.js intro and file-based routing - Route groups for layout organization
// TOPIC: Layouts and rendering strategies - Nested layout for main pages
import { Navbar } from '@/components/Navbar';

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </main>
      <footer style={{
        backgroundColor: 'var(--color-background-secondary)',
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--spacing-xl) 0',
        marginTop: 'var(--spacing-2xl)',
      }}>
        <div className="container" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          <p>© 2026 EventHub. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
