// TOPIC: API routes and route handlers - Data access layer for JSON storage
// This module provides CRUD operations for users, events, and registrations
// In a real application, this would connect to a database

import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

// Helper to read JSON files
function readJSONFile(filename) {
  const filePath = path.join(dataDir, filename);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

// Helper to write JSON files
function writeJSONFile(filename, data) {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Users
export function getUsers() {
  return readJSONFile('users.json');
}

export function getUserById(id) {
  const users = getUsers();
  return users.find(user => user.id === id);
}

export function getUserByEmail(email) {
  const users = getUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export function createUser(userData) {
  const users = getUsers();
  const newUser = {
    id: String(Date.now()),
    ...userData,
  };
  users.push(newUser);
  writeJSONFile('users.json', users);
  return newUser;
}

export function updateUser(id, updates) {
  const users = getUsers();
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates };
  writeJSONFile('users.json', users);
  return users[index];
}

// Events
export function getEvents() {
  return readJSONFile('events.json');
}

export function getEventById(id) {
  const events = getEvents();
  return events.find(event => event.id === id);
}

export function createEvent(eventData) {
  const events = getEvents();
  const newEvent = {
    id: String(Date.now()),
    ...eventData,
    featured: eventData.featured || false,
  };
  events.push(newEvent);
  writeJSONFile('events.json', events);
  return newEvent;
}

export function updateEvent(id, updates) {
  const events = getEvents();
  const index = events.findIndex(event => event.id === id);
  if (index === -1) return null;
  
  events[index] = { ...events[index], ...updates };
  writeJSONFile('events.json', events);
  return events[index];
}

export function deleteEvent(id) {
  const events = getEvents();
  const filteredEvents = events.filter(event => event.id !== id);
  
  if (events.length === filteredEvents.length) {
    return false; // Event not found
  }
  
  writeJSONFile('events.json', filteredEvents);
  
  // Also delete associated registrations
  const registrations = getRegistrations();
  const filteredRegistrations = registrations.filter(reg => reg.eventId !== id);
  writeJSONFile('registrations.json', filteredRegistrations);
  
  return true;
}

// Registrations
export function getRegistrations() {
  return readJSONFile('registrations.json');
}

export function getRegistrationsByUserId(userId) {
  const registrations = getRegistrations();
  return registrations.filter(reg => reg.userId === userId);
}

export function getRegistrationsByEventId(eventId) {
  const registrations = getRegistrations();
  return registrations.filter(reg => reg.eventId === eventId);
}

export function getRegistration(userId, eventId) {
  const registrations = getRegistrations();
  return registrations.find(
    reg => reg.userId === userId && reg.eventId === eventId
  );
}

export function createRegistration(userId, eventId) {
  const registrations = getRegistrations();
  
  // Check if already registered
  const existing = getRegistration(userId, eventId);
  if (existing) {
    return existing;
  }
  
  const newRegistration = {
    id: String(Date.now()),
    userId,
    eventId,
    createdAt: new Date().toISOString(),
  };
  
  registrations.push(newRegistration);
  writeJSONFile('registrations.json', registrations);
  return newRegistration;
}

export function deleteRegistration(userId, eventId) {
  const registrations = getRegistrations();
  const filteredRegistrations = registrations.filter(
    reg => !(reg.userId === userId && reg.eventId === eventId)
  );
  
  if (registrations.length === filteredRegistrations.length) {
    return false; // Registration not found
  }
  
  writeJSONFile('registrations.json', filteredRegistrations);
  return true;
}

// Categories - derived from events
export function getCategories() {
  const events = getEvents();
  const categories = [...new Set(events.map(event => event.category))];
  return categories.sort();
}

// Get event with attendee count
export function getEventWithAttendeeCount(eventId) {
  const event = getEventById(eventId);
  if (!event) return null;
  
  const registrations = getRegistrationsByEventId(eventId);
  return {
    ...event,
    attendeeCount: registrations.length,
  };
}

// Get all events with attendee counts
export function getEventsWithAttendeeCounts() {
  const events = getEvents();
  const registrations = getRegistrations();
  
  return events.map(event => {
    const eventRegistrations = registrations.filter(reg => reg.eventId === event.id);
    return {
      ...event,
      attendeeCount: eventRegistrations.length,
    };
  });
}
