# EventHub - Event Management Web Application

A complete event management platform built with Next.js (App Router), featuring authentication, role-based access control, real-time updates, and an interactive map interface.

## 🚀 Features

### For All Users (Guests)
- Browse and search events with advanced filters
- View event details with interactive maps
- Filter by category, price, and date range
- Responsive mobile-first design
- Light/dark theme toggle
- **Prices displayed in Ethiopian Birr (ETB)**

### For Registered Users
- All guest features
- **Purchase event tickets (paid events) via Chapa payment gateway**
- **Get free tickets for free events**
- View "My Registrations" page with ticket information
- User profile management
- Download calendar (.ics) files

### For Organisers
- All user features
- **Create and manage events with ETB pricing**
- **View detailed attendee lists with ticket information**
- **Track ticket sales and revenue**
- Export attendee data to CSV
- Dashboard with analytics (total tickets, revenue, capacity)
- Real-time attendee count updates

## 📋 Prerequisites

- Node.js 18.x or later
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and configure:
   ```env
   # Required: Generate a secure random string (min 32 characters)
   SESSION_SECRET=your-super-secret-key-change-this-in-production

   # Optional: Ticketmaster API key for external events demo
   TICKETMASTER_API_KEY=your-ticketmaster-api-key

   # Required for paid events: Chapa payment gateway secret key
   # Get your key from https://dashboard.chapa.co/
   CHAPA_SECRET_KEY=your-chapa-secret-key

   # Site URL for production deployment
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   **Generate a secure SESSION_SECRET:**
   ```bash
   # On macOS/Linux:
   openssl rand -base64 32

   # Or use Node.js:
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👤 Demo Credentials

### Regular User
- **Email:** bob@example.com
- **Password:** password123

### Organiser
- **Email:** alice@eventhub.com
- **Password:** password123

> **Note:** Passwords in the demo are intentionally simple. In the actual implementation, they're hashed using a placeholder function. For production, implement proper password hashing with bcrypt or argon2.

## 💳 Payment Integration (Chapa)

EventHub uses **Chapa** payment gateway for Ethiopian Birr (ETB) transactions.

### Setting up Chapa:

1. **Create a Chapa account** at [https://dashboard.chapa.co/](https://dashboard.chapa.co/)
2. **Get your API keys** from the dashboard (use test mode for development)
3. **Add your secret key** to `.env.local`:
   ```env
   CHAPA_SECRET_KEY=your_secret_key_here
   ```

### Testing Payments:

When using Chapa test mode, you can use their test card numbers:
- **Test Card:** Any 16-digit number starting with 4 (e.g., 4000 0000 0000 0002)
- **Expiry:** Any future date
- **CVV:** Any 3 digits

### Payment Flow:

1. User clicks "Get Ticket" on a paid event
2. **Custom payment modal opens within the app** with:
   - Event summary (title, price, date, location)
   - Payment form (name, email, phone)
   - Payment methods info (cards, mobile money, bank transfer)
   - Secure payment badge
3. User fills in their details
4. Clicks "Pay {price} ETB" button
5. System initializes payment with Chapa
6. User is redirected to Chapa's secure payment page
7. After payment, user is redirected back to the event page
8. Ticket is automatically registered to the user's account
9. Organiser can view ticket sales and revenue in the attendees page

**Note:** Free events (price = 0 ETB) bypass payment and register immediately.

## 📁 Project Structure

```
event-hub/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Route group for auth pages
│   │   ├── login/
│   │   └── register/
│   ├── (main)/              # Route group for main pages
│   │   ├── events/
│   │   ├── my-registrations/
│   │   ├── profile/
│   │   └── page.js         # Home page
│   ├── organiser/           # Organiser-only routes
│   │   ├── dashboard/
│   │   └── events/
│   ├── playground/          # React Router demo
│   ├── api/                 # API Route Handlers
│   │   ├── auth/           # Authentication endpoints
│   │   ├── events/         # Event CRUD + SSE
│   │   └── external/       # External API proxy
│   ├── layout.js           # Root layout
│   ├── not-found.js        # 404 page
│   ├── error.js            # Error boundary
│   └── loading.js          # Loading state
├── components/              # Reusable components
│   ├── Button.js
│   ├── Modal.js
│   ├── EventCard.js
│   ├── ErrorBoundary.js
│   ├── LoadingSpinner.js
│   ├── Navbar.js
│   └── ThemeToggle.js
├── context/                 # React Context providers
│   ├── AuthContext.js
│   ├── ThemeContext.js
│   └── Providers.js
├── hooks/                   # Custom React hooks
│   ├── useDebounce.js
│   ├── useLocalStorage.js
│   └── useEventFilters.js
├── lib/                     # Utility functions
│   ├── auth.js             # JWT auth with jose
│   ├── data.js             # Data access layer
│   └── constants.js        # App constants
├── data/                    # JSON data storage
│   ├── users.json
│   ├── events.json
│   └── registrations.json
├── styles/                  # CSS files
│   ├── globals.css
│   └── *.module.css        # CSS Modules
├── middleware.js            # Route protection
├── next.config.js
├── package.json
└── README.md
```

## 🎯 Key Technologies

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript
- **Styling:** Plain CSS + CSS Modules
- **Data Fetching:** SWR + React Query
- **Maps:** Leaflet + React-Leaflet
- **Authentication:** JWT with jose
- **State Management:** React Context API
- **Real-time:** Server-Sent Events (SSE)

## 🔒 Authentication & Authorization

The app uses JWT-based authentication with httpOnly cookies for security:

- **Session Management:** JWT tokens signed with jose
- **Middleware:** Protects routes based on authentication status and role
- **Role-Based Access:** Three roles (guest, user, organiser)
- **Protected Routes:** `/my-registrations`, `/profile`, `/organiser/*`

## 🗺️ Maps Integration

Events are displayed on interactive maps using Leaflet:

- **Provider:** OpenStreetMap (no API key required)
- **Features:** Markers, popups, custom icons
- **Lazy Loading:** Maps are loaded with `next/dynamic` for performance

## 📡 Real-time Features

- **Server-Sent Events (SSE):** Real-time attendee count updates
- **Endpoint:** `/api/events/stream`
- **Update Interval:** Every 5 seconds
- **Auto-reconnect:** Built-in reconnection logic

## 📊 Data Export

### CSV Export (Organisers)
Organisers can export attendee lists as CSV files for their events.

### ICS Calendar Files
Users can download `.ics` calendar files for registered events to import into their calendar apps.

## 🎨 Theming

The app supports light and dark themes:

- Toggle via the theme switcher in the navigation bar
- Preference saved to localStorage
- CSS variables for consistent theming

## 🚢 Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure environment variables**
   
   Add these in Vercel dashboard → Settings → Environment Variables:
   ```
   SESSION_SECRET=<your-production-secret>
   TICKETMASTER_API_KEY=<optional>
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   
   Vercel will automatically build and deploy your app.

### Pre-Deployment Checklist

- [ ] Update `SESSION_SECRET` with a strong random value
- [ ] Set production `NEXT_PUBLIC_SITE_URL`
- [ ] Review and update CORS settings if needed
- [ ] Test all authentication flows
- [ ] Verify environment variables are set
- [ ] Test on mobile devices
- [ ] Run `npm run build` locally to check for errors

## 🧪 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

## 📚 19 React/Next.js Topics Covered

This project demonstrates all 19 required topics:

1. **Props and rendering patterns** - EventCard, Button, Modal components
2. **State and events** - useState in forms and filters
3. **Side effects** - useEffect for data fetching, cleanup, document title
4. **Hooks deep dive** - Custom hooks, useMemo, useCallback, useReducer
5. **React Router** - Demo page with MemoryRouter
6. **Context API** - AuthContext, ThemeContext
7. **Forms** - Login, register, event creation with validation
8. **Error boundary** - ErrorBoundary class component
9. **Next.js intro** - File-based routing, dynamic routes
10. **Layouts** - Root layout, nested layouts, route groups
11. **Server/client components** - Proper separation and "use client"
12. **API routes** - Full CRUD with authentication
13. **Next.js foundation** - Clean project structure
14. **SWR and React Query** - Data fetching and caching
15. **Middleware** - Route protection and role-based access
16. **Optimization** - next/image, next/font, lazy loading
17. **Metadata and SEO** - generateMetadata, sitemap, robots
18. **Maps and real-time** - Leaflet maps, SSE, CSV/ICS export
19. **Event handling** - onClick, onChange, keyboard events

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Kill the process using port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Maps not displaying
- Ensure you have an internet connection (OpenStreetMap tiles)
- Check browser console for errors
- Verify Leaflet CSS is loaded

### Session/Authentication issues
- Clear browser cookies
- Verify `SESSION_SECRET` is set in `.env.local`
- Check that cookies are enabled in your browser

## 📝 Notes

- **Data Storage:** This demo uses JSON files. For production, implement a real database (PostgreSQL, MongoDB, etc.)
- **Password Hashing:** The demo uses a placeholder. Use bcrypt or argon2 in production
- **File Uploads:** Event images use URLs. Implement actual file upload for production
- **Email Verification:** Not implemented. Add for production use
- **Rate Limiting:** Consider adding rate limiting for API routes
- **Testing:** Add unit and integration tests for production

## 📄 License

This project is for educational purposes.

## 👥 Authors

EventHub Team

---

**Built with ❤️ using Next.js**
