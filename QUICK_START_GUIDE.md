# EventHub Quick Start Guide

## 🎯 Quick Demo of New Features

### Step 1: Login as Organiser

1. Go to `http://localhost:3000/login`
2. Use credentials:
   - Email: `alice@eventhub.com`
   - Password: `password123`
3. You'll be redirected to the home page

### Step 2: Create Your First Event

1. Click "Dashboard" in the navigation
2. Click "Create New Event" button
3. Fill in the form:
   ```
   Title: Ethiopian Coffee Festival
   Description: Celebrate Ethiopian coffee culture
   Category: Food
   Date: (pick a future date)
   Time: 14:00
   Location Name: Meskel Square, Addis Ababa
   Latitude: 9.0320
   Longitude: 38.7469
   Image: (leave empty for default)
   Price: 250 (ETB)
   Capacity: 100
   Featured: ✓ (check this)
   ```
4. Click "Create Event"
5. You'll see your event in the dashboard

### Step 3: View Your Event Publicly

1. Click "Events" in the navigation
2. You should see your new event with "250 ETB" price
3. Click on the event card to view details
4. You'll see "Get Ticket - 250.00 ETB" button
5. As the organiser, you'll also see "View Attendees" button

### Step 4: Check Ticket Sales (Initially Empty)

1. On your event detail page, click "View Attendees"
2. You'll see:
   - Total Tickets: 0
   - Ticket Revenue: 0.00 ETB
   - Capacity Used: 0%
   - Empty attendee table

### Step 5: Test as a User

1. Logout (click your name → Logout)
2. Login as a user:
   - Email: `bob@example.com`
   - Password: `password123`
3. Go to "Events" and click on your event
4. Click "Get Ticket - 250.00 ETB"

### Step 6: Payment Flow (Without Chapa Configured)

**If Chapa is NOT configured:**
- You'll see an error about Chapa not being configured
- This is expected in development without API keys

**If Chapa IS configured:**
- You'll be redirected to Chapa's payment page
- Complete payment using test card
- You'll be redirected back with ticket registered

**To test without payment (make a free event):**
1. Create a new event with Price: 0
2. Click "Get Free Ticket"
3. Ticket is registered immediately!

### Step 7: View Ticket Sales as Organiser

1. Logout and login as organiser again
2. Go to your event → "View Attendees"
3. You'll see:
   - Updated ticket count
   - Calculated revenue in ETB
   - Attendee details in table
   - Download CSV button

## 🎫 Creating Different Event Types

### Free Event (No Payment Required)
```
Price (ETB): 0
```
Users can get tickets instantly without payment.

### Paid Event (Requires Chapa)
```
Price (ETB): 250
```
Users must complete Chapa payment to get ticket.

## 💳 Setting Up Chapa for Real Payments

### 1. Create Chapa Account
- Go to https://dashboard.chapa.co/
- Sign up for an account
- Verify your email

### 2. Get API Keys
- Login to dashboard
- Go to Settings → API Keys
- Copy your **Secret Key** (starts with `CHASECK_TEST-` for test mode)

### 3. Add to Environment
```bash
# In .env.local
CHAPA_SECRET_KEY=CHASECK_TEST-your-key-here
```

### 4. Restart Server
```bash
npm run dev
```

### 5. Test with Chapa Test Cards
When on Chapa's payment page:
- **Card Number:** 4000 0000 0000 0002 (or any 16-digit starting with 4)
- **Expiry:** 12/25 (any future date)
- **CVV:** 123 (any 3 digits)
- **Name:** Test User

## 📊 Organiser Dashboard Features

### Statistics Overview
- **Total Events:** All your created events
- **Total Attendees:** Sum of all tickets across events
- **Upcoming Events:** Events with future dates

### Event List
- Shows all your events with:
  - Ticket count
  - Capacity
  - Price in ETB
  - Featured badge

### Attendees Page (Per Event)
- **Total Tickets:** Number of sold tickets
- **Ticket Revenue:** Total in ETB (price × tickets)
- **Capacity Used:** Percentage of capacity filled
- **Tickets Left:** Remaining capacity

### Attendee Table
- Sequential numbering
- Name and email
- Registration timestamp
- Confirmation status
- CSV export button

## 🔍 Finding Events

### Browse All Events
- Go to `/events`
- Use filters:
  - Search by name/description
  - Category filter
  - Price (All/Free/Paid)
  - Date range

### View Event Details
- Click any event card
- See full description
- Interactive map with location
- Ticket availability
- Price in ETB

## ✅ Testing Checklist

**As Organiser:**
- [ ] Create free event (0 ETB)
- [ ] Create paid event (e.g., 250 ETB)
- [ ] View events in dashboard
- [ ] Check statistics update
- [ ] View attendees page (empty initially)

**As User:**
- [ ] Browse public events
- [ ] View event details
- [ ] Get free ticket (instant)
- [ ] Attempt paid ticket (Chapa or error)
- [ ] Check "My Registrations"

**Back as Organiser:**
- [ ] View updated attendees page
- [ ] Check ticket count increased
- [ ] Verify revenue calculation
- [ ] Download CSV file
- [ ] Review attendee details

## 🎉 Success Indicators

You'll know everything works when:

1. ✅ Organisers can create events with ETB pricing
2. ✅ Events show "ETB" instead of "$"
3. ✅ Free events register instantly
4. ✅ Paid events require payment (or show Chapa error)
5. ✅ Attendees page shows ticket count and revenue
6. ✅ CSV download works with attendee data

## 🆘 Troubleshooting

### "Chapa secret key not configured"
- Add `CHAPA_SECRET_KEY` to `.env.local`
- Restart development server

### "Invalid email or password"
- Check you're using exact credentials:
  - `alice@eventhub.com` / `password123` (organiser)
  - `bob@example.com` / `password123` (user)

### Event not appearing
- Refresh the page
- Check you're logged in as the organiser who created it
- Verify event was created (check dashboard)

### Attendees page shows error
- Ensure you're logged in as the organiser
- Verify you own the event
- Check event ID in URL is correct

## 📞 Support

For issues or questions:
1. Check this guide
2. Review FEATURE_UPDATES.md
3. Check README.md for setup steps
4. Verify environment variables

---

**Happy Event Managing! 🎉**
