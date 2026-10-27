# EventHub - Testing Guide

## 🚀 Dev Server Running

The app is now running at: **http://localhost:3001**

## 🎯 Testing the Custom Chapa Payment UI

### Step 1: Login as a User
1. Go to http://localhost:3001
2. Click "Login" in the navigation
3. Use these credentials:
   - **Email:** `bob@example.com`
   - **Password:** `password123`

### Step 2: Browse Events
1. After logging in, click "Events" in the navigation
2. You'll see a list of events with prices in **ETB** (Ethiopian Birr)

### Step 3: Test the Payment Modal (Paid Event)
1. Find an event with a price > 0 ETB
2. Click on the event to see details
3. Click the "Get Ticket" button
4. **The custom payment modal should open** with:
   - ✅ Event summary (title, price, date, location)
   - ✅ Security badge ("🔒 Secure Payment powered by Chapa")
   - ✅ Payment form (First Name, Last Name, Email, Phone)
   - ✅ Your name and email pre-filled from your account
   - ✅ Payment methods info (Cards, Mobile Money, Bank Transfer)

### Step 4: Fill the Payment Form
1. Your first/last name and email should already be filled
2. Enter a phone number (Ethiopian format):
   - Example: `0912345678` or `0712345678`
   - Or with country code: `+251912345678`
3. Click "Pay {price} ETB" button

### Step 5: Expected Behavior
**With Chapa configured:**
- You'll be redirected to Chapa's payment page
- Complete the payment there
- Return to the event page
- Your ticket is registered

**Without Chapa configured (testing mode):**
- You'll see an error message (expected)
- This is normal - Chapa needs a real API key to work

### Step 6: Test Free Events
1. Find an event with **0 ETB** price
2. Click "Get Ticket"
3. **No payment modal should appear**
4. You should be registered immediately
5. Button changes to "Unregister"

---

## 👨‍💼 Testing Organiser Features

### Step 1: Login as an Organiser
1. Logout if you're logged in as a user
2. Go to login page
3. Use these credentials:
   - **Email:** `alice@eventhub.com`
   - **Password:** `password123`

### Step 2: Access Organiser Dashboard
1. After login, click "Dashboard" in the navigation
2. You should see the organiser dashboard

### Step 3: Create a New Event
1. Click "Create Event" or go to `/organiser/events/new`
2. Fill out the form:
   - **Title:** "Test Event"
   - **Description:** "This is a test"
   - **Category:** Select any
   - **Date:** Select a future date
   - **Price:** Enter a price in ETB (e.g., `150`)
   - **Location:** Enter location details
   - **Latitude/Longitude:** Use Ethiopian coordinates (e.g., `9.0320`, `38.7469` for Addis Ababa)
   - **Capacity:** Enter a number (e.g., `100`)
3. Click "Create Event"

### Step 4: View Attendees & Revenue
1. Go back to your dashboard
2. Find an event that has tickets sold
3. Click "Attendees" button
4. You should see:
   - ✅ Ticket statistics (sold tickets, revenue in ETB, capacity)
   - ✅ List of attendees with their details
   - ✅ "Export CSV" button to download attendee list

---

## 🎨 UI Features to Verify

### Payment Modal Design
- ✅ Modal opens centered on screen
- ✅ Event summary has secondary background color
- ✅ Security badge has blue background
- ✅ Form fields are properly aligned
- ✅ Required fields marked with red asterisk (*)
- ✅ Error messages appear below fields
- ✅ Buttons are aligned to the right
- ✅ "Cancel" button is outline style
- ✅ "Pay" button is primary style with price

### Form Validation
Test these scenarios:
1. **Empty fields:** Leave first name empty → Click Pay → Error shows
2. **Invalid email:** Enter "notanemail" → Error shows
3. **Invalid phone:** Enter "123" → Error shows
4. **Valid phone formats that should work:**
   - `0912345678` ✅
   - `0712345678` ✅
   - `+251912345678` ✅
   - `+251712345678` ✅
5. **Invalid phone formats that should fail:**
   - `0812345678` ❌ (08 prefix not valid)
   - `123456` ❌ (too short)
   - `abcdefgh` ❌ (not a number)

### Currency Display
Check that all prices show **ETB** (not $):
- ✅ Event cards on events list page
- ✅ Event detail page
- ✅ Payment modal
- ✅ Event creation form
- ✅ Attendees page (revenue)

---

## 🐛 Known Limitations

### Chapa Integration
- **Without API Key:** Payment will fail at the initialization step
- **With API Key:** Set `CHAPA_SECRET_KEY` in `.env.local` to enable real payments

### Build Process
- SSE endpoint (`/api/events/stream`) is marked as dynamic to prevent build timeout
- This is normal for streaming endpoints

---

## 📱 Mobile Testing

### Responsive Design
Test on mobile or narrow browser window:
1. **Payment Modal:**
   - Should fit within screen
   - Form fields stack vertically
   - Buttons are full-width or properly sized
   - Easy to scroll if needed

2. **Event Cards:**
   - Should stack in single column
   - Images scale properly

3. **Navigation:**
   - Hamburger menu on mobile (if implemented)
   - Links are touch-friendly

---

## ✅ Feature Checklist

### User Features
- [ ] Browse events with prices in ETB
- [ ] Click event to see details
- [ ] Click "Get Ticket" opens payment modal
- [ ] Payment form validates Ethiopian phone numbers
- [ ] Free events register immediately (no modal)
- [ ] Paid events show payment modal
- [ ] User data pre-fills in form

### Organiser Features
- [ ] Login as organiser
- [ ] Access dashboard
- [ ] Create new event with ETB pricing
- [ ] View list of own events
- [ ] Click "Attendees" to see ticket sales
- [ ] See revenue in ETB
- [ ] See ticket count and capacity
- [ ] Export attendees to CSV

### Payment Flow
- [ ] Modal shows event summary
- [ ] Modal shows security badge
- [ ] Modal shows payment methods
- [ ] Form validates before submission
- [ ] Loading state shows during processing
- [ ] Cancel button closes modal
- [ ] Errors display properly

---

## 🎉 Success Criteria

The payment UI update is successful if:
1. ✅ Custom payment modal opens instead of immediate redirect
2. ✅ Event details are clearly displayed
3. ✅ Form validates Ethiopian phone numbers
4. ✅ User information is pre-filled
5. ✅ All prices show in ETB (not USD)
6. ✅ Free events work without payment
7. ✅ Modal is responsive on mobile
8. ✅ Clear error messages guide the user

---

## 🔧 Troubleshooting

### Issue: Login fails with "Invalid email or password"
**Solution:** Make sure you're using the exact credentials:
- User: `bob@example.com` / `password123`
- Organiser: `alice@eventhub.com` / `password123`

### Issue: Payment modal doesn't open
**Check:**
1. Is the event price > 0 ETB?
2. Are you logged in?
3. Check browser console for errors

### Issue: Phone validation fails
**Check format:**
- Must start with `09`, `07`, `+2519`, or `+2517`
- Must have correct total length
- No spaces or dashes

### Issue: Build hangs
**Solution:** SSE endpoint is now marked as dynamic. Use `npm run dev` for development.

### Issue: Chapa payment fails
**Expected:** Without real API key configured, payment initialization will fail. This is normal for testing.

---

## 📞 Next Steps

1. **Test all features** using this guide
2. **Configure Chapa** (optional):
   - Get API key from https://chapa.co
   - Add to `.env.local` as `CHAPA_SECRET_KEY`
3. **Deploy** when ready:
   - `npm run build` (should work now)
   - Deploy to Vercel/Netlify
4. **Add real event data** through organiser interface

Happy testing! 🎉
