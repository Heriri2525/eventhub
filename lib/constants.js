// TOPIC: Next.js foundation - Application constants and configuration

export const SITE_NAME = 'EventHub';
export const SITE_DESCRIPTION = 'Discover and register for amazing events';

export const ROLES = {
  GUEST: 'guest',
  USER: 'user',
  ORGANISER: 'organiser',
};

export const CATEGORIES = [
  'Music',
  'Technology',
  'Arts',
  'Business',
  'Sports',
  'Food',
];

export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  PAST: 'past',
};

export const ITEMS_PER_PAGE = 9;

export const MAX_EVENTS_PER_ORGANISER = 100;

export const PASSWORD_MIN_LENGTH = 6;

export const SESSION_COOKIE_NAME = 'session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

// Default event image if none provided
export const DEFAULT_EVENT_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop';

// Map configuration
export const MAP_DEFAULT_CENTER = [40.7128, -74.0060]; // New York City
export const MAP_DEFAULT_ZOOM = 13;
export const MAP_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
