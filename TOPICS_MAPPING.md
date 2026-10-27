# EventHub - 19 React/Next.js Topics Mapping

This document maps all 19 required React/Next.js topics to their implementations in the EventHub project.

## 1. Props and Rendering Patterns

**Files:**
- `components/Button.js` - Reusable button with variant, size, and state props
- `components/Modal.js` - Modal with compound component pattern (Modal.Header, Modal.Body, Modal.Footer)
- `components/EventCard.js` - Event card with conditional rendering based on props
- `app/(main)/page.js` - List rendering with `.map()` and keys, conditional rendering

**Key Concepts:**
- Props destructuring and default values
- Children prop pattern
- Conditional rendering with `&&` and ternary operators
- List rendering with unique keys
- Composition patterns
- Compound components

---

## 2. State and Events (useState)

**Files:**
- `app/(auth)/login/page.js` - Form state management (email, password, errors, loading)
- `app/(auth)/register/page.js` - Complex form state with multiple fields
- `app/(main)/events/page.js` - Search input state and filter state
- `components/Modal.js` - Modal open/close state

**Key Concepts:**
- useState for form inputs
- State updates with user interactions
- State for UI control (modals, loading states)
- Controlled components

---

## 3. Side Effects (useEffect, useRef)

**Files:**
- `context/ThemeContext.js` - useEffect for localStorage sync and document attribute updates
- `context/AuthContext.js` - useEffect to fetch current user on mount
- `components/Modal.js` - useEffect for keyboard event listeners with cleanup, useRef for focus management
- `app/(main)/events/[id]/page.js` - useEffect to update document title

**Key Concepts:**
- useEffect with dependency arrays
- Cleanup functions for event listeners and timeouts
- useRef for DOM references
- useRef for storing mutable values (map instances)

---

## 4. Hooks Deep Dive

**Files:**
- `hooks/useDebounce.js` - Custom hook with useEffect and cleanup
- `hooks/useLocalStorage.js` - Custom hook for persistent state
- `hooks/useEventFilters.js` - useReducer for complex filter state, useMemo for computed values, useCallback for actions
- `context/AuthContext.js` - useContext pattern with custom useAuth hook
- `context/ThemeContext.js` - useContext pattern with custom useTheme hook

**Key Concepts:**
- Custom hooks creation and reusability
- useReducer for complex state logic
- useMemo for expensive computations
- useCallback for memoized functions
- useContext for global state access

---

## 5. React Router

**Files:**
- `app/playground/router/page.js` - Complete React Router demo with MemoryRouter

**Key Concepts:**
- MemoryRouter vs BrowserRouter
- Routes and Route configuration
- Link component for navigation
- useLocation hook for current route
- useParams hook for route parameters
- Nested routing
- 404 handling with catch-all route
- Comparison with Next.js file-based routing

---

## 6. Context API and State Management

**Files:**
- `context/AuthContext.js` - Authentication state management
- `context/ThemeContext.js` - Theme (light/dark) state management
- `context/Providers.js` - Combined provider wrapper
- `app/layout.js` - Providers wrapping entire app

**Key Concepts:**
- createContext and Provider pattern
- useContext hook for consuming context
- Custom hooks for context access (useAuth, useTheme)
- Multiple context providers
- Context for cross-cutting concerns

---

## 7. Forms and Controlled Components

**Files:**
- `app/(auth)/login/page.js` - Login form with validation
- `app/(auth)/register/page.js` - Registration form with complex validation
- `app/(main)/events/page.js` - Search and filter form
- `styles/Form.module.css` - Form styling

**Key Concepts:**
- Controlled inputs with value and onChange
- Form validation
- Error message display
- Disabled and loading states
- Form submission with preventDefault
- Input types (text, email, password, select)

---

## 8. Error Boundary, Performance, Lazy Loading

**Files:**
- `components/ErrorBoundary.js` - Class component error boundary
- `app/error.js` - Next.js error boundary
- `app/not-found.js` - Custom 404 page
- `components/EventCard.js` - React.memo for performance
- `app/(main)/events/[id]/page.js` - Dynamic import with next/dynamic for map
- `components/EventMap.js` - Lazy-loaded map component

**Key Concepts:**
- Error boundary class component with componentDidCatch
- React.memo for component memoization
- next/dynamic for code splitting
- Loading states for lazy components
- SSR: false for client-only components

---

## 9. Next.js Intro and File-Based Routing

**Files:**
- `app/(main)/page.js` - Home route
- `app/(auth)/login/page.js` - Login route
- `app/(main)/events/[id]/page.js` - Dynamic route with [id]
- `app/(main)/layout.js` - Route group (main)
- `app/(auth)/` - Route group (auth)

**Key Concepts:**
- File-based routing with app directory
- Dynamic routes with [param]
- Route groups with (folder)
- page.js for routes
- layout.js for nested layouts

---

## 10. Layouts and Rendering Strategies

**Files:**
- `app/layout.js` - Root layout with metadata
- `app/(main)/layout.js` - Nested layout with Navbar
- `app/organiser/layout.js` - Organiser nested layout with sidebar
- `app/(main)/page.js` - SSG (Static Site Generation)
- `app/(main)/events/page.js` - ISR-like behavior with SWR
- `app/(main)/events/[id]/page.js` - SSR-like with React Query

**Key Concepts:**
- Root layout pattern
- Nested layouts
- SSG with data fetching at build time
- ISR with revalidation
- SSR with dynamic data fetching

---

## 11. Server and Client Components

**Files:**
- `app/layout.js` - Server component (no "use client")
- `app/(main)/page.js` - Server component
- `app/(auth)/login/page.js` - Client component ("use client")
- `components/Modal.js` - Client component (uses DOM APIs)
- `components/Navbar.js` - Client component (uses hooks)

**Key Concepts:**
- Default server components
- "use client" directive for client components
- When to use each (interactivity vs data fetching)
- Browser APIs require client components
- Hooks require client components

---

## 12. API Routes and Route Handlers

**Files:**
- `app/api/auth/register/route.js` - POST endpoint with validation
- `app/api/auth/login/route.js` - POST endpoint with authentication
- `app/api/auth/logout/route.js` - POST endpoint for session cleanup
- `app/api/auth/me/route.js` - GET endpoint for current user
- `app/api/events/route.js` - GET/POST endpoints
- `app/api/events/[id]/route.js` - GET/PUT/DELETE endpoints
- `app/api/events/[id]/register/route.js` - POST/DELETE registration
- `app/api/events/[id]/attendees/route.js` - GET attendees list

**Key Concepts:**
- Route handlers with named exports (GET, POST, PUT, DELETE)
- Request/response handling with NextResponse
- HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- JSON responses
- Error handling
- Authentication and authorization
- Dynamic route parameters

---

## 13. Next.js Foundation Project

**Files:**
- Project structure with clear organization
- `app/` - App Router pages and API
- `components/` - Reusable components
- `context/` - Context providers
- `hooks/` - Custom hooks
- `lib/` - Utility functions
- `data/` - JSON data storage
- `styles/` - CSS files
- Configuration files (next.config.js, jsconfig.json, .env.example)

**Key Concepts:**
- Clean folder structure
- Separation of concerns
- Path aliases with @ prefix
- Environment variables
- Configuration management

---

## 14. Data Fetching with SWR and React Query

**Files:**
- `app/(main)/events/page.js` - SWR for events list with revalidation
- `app/(main)/events/[id]/page.js` - React Query useQuery and useMutation
- `app/organiser/dashboard/page.js` - React Query for dashboard data
- `context/Providers.js` - QueryClientProvider setup

**Key Concepts:**
- SWR fetcher function
- SWR revalidation options
- React Query useQuery hook
- React Query useMutation hook
- Cache invalidation with queryClient
- Loading and error states
- Optimistic updates

---

## 15. Middleware and Authentication

**Files:**
- `middleware.js` - Route protection and role-based access
- `lib/auth.js` - JWT creation and verification with jose

**Key Concepts:**
- Middleware function for request interception
- Session verification from cookies
- Role-based routing (guest, user, organiser)
- Redirects based on authentication status
- Protected routes
- Middleware config with matcher

---

## 16. Optimisation and Environment

**Files:**
- `components/EventCard.js` - next/image for optimization
- `app/(main)/events/[id]/page.js` - Dynamic imports with next/dynamic
- `.env.example` and `.env.local` - Environment variables
- `next.config.js` - Image optimization config
- `app/api/external/events/route.js` - Server-side API proxy

**Key Concepts:**
- next/image for automatic image optimization
- Lazy loading with next/dynamic
- Environment variables (NEXT_PUBLIC_ prefix)
- Server-side API proxy to hide keys
- Bundle optimization with code splitting

---

## 17. Metadata and SEO

**Files:**
- `app/layout.js` - Static metadata with Open Graph tags
- `app/(main)/page.js` - Page-specific metadata
- `app/sitemap.js` - Dynamic sitemap generation
- `app/robots.js` - Robots.txt configuration

**Key Concepts:**
- Static metadata export
- generateMetadata for dynamic metadata
- Open Graph tags
- Twitter cards
- Sitemap generation
- Robots.txt configuration
- SEO best practices

---

## 18. Maps, Real-time and Data Formats

**Files:**
- `components/EventMap.js` - Leaflet map integration
- `app/(main)/events/[id]/page.js` - Map display and ICS calendar download
- `app/api/events/stream/route.js` - Server-Sent Events (SSE) endpoint
- `lib/constants.js` - Map configuration

**Key Concepts:**
- Leaflet with react-leaflet
- OpenStreetMap tiles (no API key)
- Map markers and popups
- Server-Sent Events for real-time updates
- ICS calendar file generation and download
- CSV export capability (in attendees route)
- JSON data handling

---

## 19. Event Handling and Deployment

**Files:**
- `components/Modal.js` - onClick, onKeyDown (ESC key), event delegation
- `app/(auth)/login/page.js` - onChange, onSubmit
- `components/Navbar.js` - onClick handlers
- `README.md` - Comprehensive deployment instructions

**Key Concepts:**
- onClick event handlers
- onChange for form inputs
- onSubmit with preventDefault
- Keyboard events (ESC key handling)
- Event delegation pattern (overlay click)
- onMouseEnter/onMouseLeave for hover effects
- Deployment to Vercel
- Environment variable configuration
- Pre-deployment checklist
- Build verification

---

## Summary

All 19 required topics are fully implemented throughout the EventHub application with clear examples and comments marking where each topic is demonstrated. The application provides a complete, production-ready structure that showcases modern React and Next.js best practices.
