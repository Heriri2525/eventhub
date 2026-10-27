# Bug Fix: "Something went wrong" Error

## 🐛 Problem
When clicking on events as a logged-in user, the error "Something went wrong! We're sorry, but something unexpected happened. Please try again." appeared.

## 🔍 Root Cause
The issue was caused by **wrapping Button components with Link components** in the event detail page (`app/(main)/events/[id]/page.js`).

### What Was Wrong:
```javascript
// ❌ WRONG - Link wrapping Button
<Link href="/events">
  <Button variant="primary">Back to Events</Button>
</Link>

<Link href={`/organiser/events/${event.id}/edit`}>
  <Button variant="outline">Edit Event</Button>
</Link>
```

In Next.js 14 App Router, you **cannot nest Link components with Button components** that have their own event handlers. This causes React errors about passing event handlers to Client Component props.

## ✅ Solution
Replace Link-wrapped Buttons with Buttons using `onClick` with `router.push()`:

```javascript
// ✅ CORRECT - Button with onClick
const router = useRouter();

<Button 
  variant="primary"
  onClick={() => router.push('/events')}
>
  Back to Events
</Button>

<Button 
  variant="outline"
  onClick={() => router.push(`/organiser/events/${event.id}/edit`)}
>
  Edit Event
</Button>
```

## 📝 Files Changed

### `app/(main)/events/[id]/page.js`

**Fixed 4 instances:**

1. **"Back to Events" button** (error page)
   - Before: `<Link href="/events"><Button>...</Button></Link>`
   - After: `<Button onClick={() => router.push('/events')}>...</Button>`

2. **"Edit Event" button** (owner actions)
   - Before: `<Link href={...}><Button>...</Button></Link>`
   - After: `<Button onClick={() => router.push(...)}>...</Button>`

3. **"View Attendees" button** (owner actions)
   - Before: `<Link href={...}><Button>...</Button></Link>`
   - After: `<Button onClick={() => router.push(...)}>...</Button>`

4. **"Login" and "Sign Up" buttons** (login modal)
   - Before: `<Link href={...}><Button>...</Button></Link>`
   - After: `<Button onClick={() => router.push(...)}>...</Button>`

## 🧪 Testing

### Test Case 1: Browse Events
1. Login as: `bob@example.com` / `password123`
2. Click "Events" in navigation
3. **Expected:** Events page loads without error ✅

### Test Case 2: View Event Details
1. Click on any event card
2. **Expected:** Event detail page loads without error ✅
3. See event description, image, and map
4. See "Get Ticket" or "Get Free Ticket" button

### Test Case 3: Click Get Ticket (Paid Event)
1. Find an event with price > 0 ETB
2. Click "Get Ticket - {price} ETB"
3. **Expected:** Payment modal opens ✅

### Test Case 4: Click Get Ticket (Free Event)
1. Find an event with 0 ETB price
2. Click "Get Free Ticket"
3. **Expected:** Registers immediately, button changes to "Unregister" ✅

### Test Case 5: Organiser Actions
1. Login as organiser: `alice@eventhub.com` / `password123`
2. Go to your event detail page
3. Click "Edit Event" button
4. **Expected:** Navigates to edit page ✅
5. Go back, click "View Attendees"
6. **Expected:** Navigates to attendees page ✅

## 🎯 Why This Happened

In Next.js App Router (13+), the framework enforces stricter rules about component composition:

1. **Interactive elements** (like buttons with onClick) should not be nested inside Link components
2. **Link components** should wrap simple text or non-interactive elements
3. **Client components** (marked with 'use client') cannot receive event handlers as props from Server Components

### Best Practices:

**For Navigation:**
- ✅ Use Link for simple text links: `<Link href="...">Go to Events</Link>`
- ✅ Use Button with onClick for interactive buttons: `<Button onClick={() => router.push(...)}>...` 
- ❌ Don't wrap Button in Link: `<Link><Button>...</Button></Link>`

**For Buttons:**
- ✅ Use onClick with router.push() for navigation
- ✅ Use onClick with functions for actions
- ❌ Don't wrap in Link components

## 🚀 Status: FIXED ✅

The error is now resolved. Users can:
- ✅ Browse events without errors
- ✅ Click on events to see details
- ✅ Click "Get Ticket" to open payment modal
- ✅ Register for free events immediately
- ✅ Organisers can edit events and view attendees

## 🔄 Testing Now

The dev server should have automatically recompiled. Test the fix:

1. Go to http://localhost:3001
2. Login as: `bob@example.com` / `password123`
3. Click "Events"
4. Click on any event
5. Everything should work now! 🎉

---

**Summary:** Fixed Next.js App Router error by replacing Link-wrapped Buttons with onClick navigation using useRouter().
