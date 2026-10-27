'use client';

// TOPIC: React Router - Demo page showing react-router-dom usage
import { MemoryRouter, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/Button';

// Demo components for routes
function Home() {
  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <h2>React Router Demo - Home</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
        This is a client-side routing demonstration using react-router-dom's MemoryRouter.
      </p>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
        Unlike Next.js file-based routing (which uses the file system and supports server-side rendering),
        this demo uses in-memory routing that keeps the URL in memory (doesn't change the browser URL).
      </p>
      <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-md)' }}>
        <Link to="/about">
          <Button variant="primary">Go to About</Button>
        </Link>
        <Link to="/users/123">
          <Button variant="outline">View User 123</Button>
        </Link>
      </div>
    </div>
  );
}

function About() {
  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <h2>About Page</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
        This route demonstrates client-side navigation without page reloads.
      </p>
      <Link to="/" style={{ display: 'inline-block', marginTop: 'var(--spacing-lg)' }}>
        <Button variant="outline">Back to Home</Button>
      </Link>
    </div>
  );
}

function User() {
  // TOPIC: React Router - useParams hook
  const { id } = useParams();
  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <h2>User Profile</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
        Viewing user with ID: <strong>{id}</strong>
      </p>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
        This demonstrates dynamic route parameters.
      </p>
      <Link to="/" style={{ display: 'inline-block', marginTop: 'var(--spacing-lg)' }}>
        <Button variant="outline">Back to Home</Button>
      </Link>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
      <h2>404 - Route Not Found</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
        This route doesn't exist in the router configuration.
      </p>
      <Link to="/" style={{ display: 'inline-block', marginTop: 'var(--spacing-lg)' }}>
        <Button variant="primary">Go Home</Button>
      </Link>
    </div>
  );
}

// Navigation component showing current route
function Navigation() {
  // TOPIC: React Router - useLocation hook
  const location = useLocation();
  
  return (
    <nav style={{
      padding: 'var(--spacing-md)',
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      gap: 'var(--spacing-lg)',
      alignItems: 'center',
    }}>
      <Link to="/" style={{ fontWeight: location.pathname === '/' ? '700' : '400' }}>
        Home
      </Link>
      <Link to="/about" style={{ fontWeight: location.pathname === '/about' ? '700' : '400' }}>
        About
      </Link>
      <Link to="/users/123" style={{ fontWeight: location.pathname.startsWith('/users') ? '700' : '400' }}>
        User
      </Link>
      <div style={{ marginLeft: 'auto', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
        Current: {location.pathname}
      </div>
    </nav>
  );
}

// Main router wrapper
function RouterApp() {
  return (
    <div style={{
      border: '2px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <Navigation />
      {/* TOPIC: React Router - Routes and nested routing */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default function ReactRouterPlayground() {
  return (
    <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ marginBottom: 'var(--spacing-md)' }}>React Router Playground</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
          This page demonstrates <strong>react-router-dom</strong> with MemoryRouter for client-side routing.
        </p>
        
        <div style={{
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--color-background-secondary)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-xl)',
        }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>
            Differences from Next.js Routing:
          </h3>
          <ul style={{ paddingLeft: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>
              <strong>Next.js:</strong> File-based routing using the app directory structure. URLs are determined by folder/file names.
            </li>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>
              <strong>React Router:</strong> Route configuration using components. Routes are defined programmatically.
            </li>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>
              <strong>Next.js:</strong> Supports server-side rendering, static generation, and server components.
            </li>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>
              <strong>React Router:</strong> Client-side only (unless using frameworks like Remix).
            </li>
            <li>
              <strong>MemoryRouter:</strong> Keeps routing state in memory, doesn't change browser URL (used here for demo).
            </li>
          </ul>
        </div>
      </div>

      {/* TOPIC: React Router - MemoryRouter for in-memory routing */}
      <MemoryRouter initialEntries={['/']} initialIndex={0}>
        <RouterApp />
      </MemoryRouter>

      <div style={{
        marginTop: 'var(--spacing-xl)',
        padding: 'var(--spacing-lg)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
      }}>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          💡 Note: This demo uses MemoryRouter which keeps the routing state in memory.
          In a real application, you'd typically use BrowserRouter which syncs with the browser URL.
        </p>
      </div>
    </div>
  );
}
