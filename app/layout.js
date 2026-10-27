// TOPIC: Layouts and rendering strategies - Root layout with providers
// TOPIC: Server and client components - Root layout is a server component
import { Providers } from '@/context/Providers';
import '@/styles/globals.css';

// TOPIC: Metadata and SEO - Static metadata for the root layout
export const metadata = {
  title: {
    template: '%s | EventHub',
    default: 'EventHub - Discover Amazing Events',
  },
  description: 'Discover and register for amazing events in your area. From music festivals to tech conferences, find your next experience on EventHub.',
  keywords: ['events', 'tickets', 'concerts', 'conferences', 'festivals', 'workshops'],
  authors: [{ name: 'EventHub Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'EventHub',
    title: 'EventHub - Discover Amazing Events',
    description: 'Discover and register for amazing events in your area.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EventHub - Discover Amazing Events',
    description: 'Discover and register for amazing events in your area.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* TOPIC: Context API and state management - Providers wrap the entire app */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
