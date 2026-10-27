'use client';

// TOPIC: Server and client components - Client component for interactive navigation
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isOrganiser, logout } = useAuth();

  // TOPIC: Event handling - onClick handlers
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav style={{
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-md) var(--spacing-lg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)' }}>
          <Link href="/" style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: '700',
            color: 'var(--color-primary)',
            textDecoration: 'none',
          }}>
            🎫 EventHub
          </Link>

          <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
            <Link 
              href="/events"
              style={{
                color: pathname.startsWith('/events') ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: pathname.startsWith('/events') ? '600' : '400',
              }}
            >
              Events
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  href="/my-registrations"
                  style={{
                    color: pathname === '/my-registrations' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    fontWeight: pathname === '/my-registrations' ? '600' : '400',
                  }}
                >
                  My Registrations
                </Link>
                
                {isOrganiser && (
                  <Link 
                    href="/organiser/dashboard"
                    style={{
                      color: pathname.startsWith('/organiser') ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      fontWeight: pathname.startsWith('/organiser') ? '600' : '400',
                    }}
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" size="small">
                  {user?.name}
                </Button>
              </Link>
              <Button variant="outline" size="small" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="small">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="small">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
