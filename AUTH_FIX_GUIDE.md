# AUTH FIX - Registration & Login Troubleshooting Guide

**Status**: ✅ **FIXES APPLIED**  
**Date**: January 7, 2026

---

## 🔧 FIXES APPLIED

### 1. Backend CORS Configuration
**File**: `backend/index.js`
```javascript
✅ BEFORE: app.use(cors());
✅ AFTER:  app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```
**Why**: Allows frontend to make requests from localhost:5173

---

### 2. Frontend API URL Consistency
**File**: `client/src/services/auth.js`
```javascript
✅ BEFORE: const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
✅ AFTER:  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4002';
```
**Why**: Matches .env.development pointing to 4002

---

### 3. Environment Variable
**File**: `client/.env.development`
```
✅ VITE_API_URL=http://localhost:4002
```

---

### 4. Enhanced Error Handling
**File**: `client/src/services/auth.js`

**register() function**:
- ✅ Added console.log for debugging
- ✅ Better error messages
- ✅ Handles network failures gracefully
- ✅ Shows real server errors

**login() function**:
- ✅ Same improvements as register()

---

## 🚀 HOW TO TEST

### Step 1: Start Backend Server
```bash
cd backend
npm start
```
**Expected Output**:
```
✅ Craftly server running on http://localhost:4002
```

### Step 2: Start Frontend Dev Server
```bash
# In another terminal
cd client
npm run dev
```
**Expected Output**:
```
➜  Local:   http://localhost:5173/
```

### Step 3: Test Registration
1. Navigate to `http://localhost:5173/signup`
2. Fill in form:
   - Full Name: `John Doe`
   - Email: `johndoe` (auto-appends @gmail.com)
   - Password: `TestPass123`
   - Confirm: `TestPass123`
3. Click "Create Account"
4. **Expected**: Auto-redirect to `/buyer` ✅

### Step 4: Test Login
1. Navigate to `http://localhost:5173/signin`
2. Login with:
   - Email: `demo@craftly.test`
   - Password: `password`
3. Click "Sign In"
4. **Expected**: Auto-redirect to `/buyer` ✅

### Step 5: Verify in Browser DevTools
**Open DevTools** (F12 → Network tab):

1. **After registration/login**:
   - Look for `POST /auth/register` or `POST /auth/login`
   - Status should be **200** (success) or **201** (created)
   - Response should include: `token`, `user`, `message`

2. **Check Console** (F12 → Console tab):
   ```
   [AUTH] Registering user: johndoe@gmail.com to http://localhost:4002/auth/register
   [AUTH] Registration successful
   ```

3. **Check LocalStorage** (F12 → Application → LocalStorage):
   - `authToken`: JWT token (long string starting with `eyJ...`)
   - `craftly_user`: User object with `id`, `email`, `name`, `role`

---

## 🔍 TROUBLESHOOTING

### Issue: "Failed to fetch"

**Cause 1: Backend not running**
- [ ] Check if backend is running on port 4002
- [ ] Run: `cd backend && npm start`
- [ ] Look for: `✅ Craftly server running on http://localhost:4002`

**Cause 2: CORS blocked**
- [ ] Check Network tab → Network request blocked
- [ ] Verify backend has CORS enabled with `http://localhost:5173`
- [ ] Restart backend after fixing CORS

**Cause 3: Wrong API URL**
- [ ] Check console: `[AUTH] Registering user: ... to http://localhost:4002/auth/register`
- [ ] Verify `.env.development` has `VITE_API_URL=http://localhost:4002`
- [ ] Verify backend runs on port 4002 (not 4000)

### Issue: "Server error: 500"

**Cause**: Backend crashed or route error
- [ ] Check backend console for error messages
- [ ] Verify auth routes exist: `/auth/register`, `/auth/login`
- [ ] Ensure `express.json()` middleware is enabled
- [ ] Restart backend

### Issue: "User already exists" (409)

**Expected behavior**: Try with different email
- [ ] Use new email: `newuser123@gmail.com`
- [ ] Or use demo user: `demo@craftly.test` / `password`

### Issue: "Invalid credentials" (401)

**Expected behavior** for login:
- [ ] Email doesn't exist → "Invalid email or password"
- [ ] Wrong password → "Invalid email or password"
- [ ] Use: `demo@craftly.test` / `password` to test

---

## 📊 API ENDPOINTS

### Register Endpoint
```bash
POST http://localhost:4002/auth/register

REQUEST:
{
  "email": "user@gmail.com",
  "password": "TestPass123",
  "name": "John Doe"
}

RESPONSE (201):
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 100,
    "email": "user@gmail.com",
    "name": "John Doe",
    "role": "buyer"
  }
}
```

### Login Endpoint
```bash
POST http://localhost:4002/auth/login

REQUEST:
{
  "email": "demo@craftly.test",
  "password": "password"
}

RESPONSE (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "demo@craftly.test",
    "name": "Demo User",
    "role": "buyer"
  }
}
```

---

## ✅ VERIFICATION CHECKLIST

After fixes, verify:

- [ ] Backend starts: `npm start` in /backend → port 4002
- [ ] Frontend starts: `npm run dev` in /client → port 5173
- [ ] .env.development has: `VITE_API_URL=http://localhost:4002`
- [ ] Backend console shows: `✅ Craftly server running on http://localhost:4002`
- [ ] Sign up works → redirects to /buyer
- [ ] Sign in works → redirects to /buyer
- [ ] Login persists → refresh page, still logged in
- [ ] Logout works → redirected to /signin
- [ ] DevTools Network tab shows successful requests
- [ ] DevTools Console shows no errors (only [AUTH] logs)

---

## 🎯 DEMO USERS FOR TESTING

| Email | Password | Role |
|-------|----------|------|
| demo@craftly.test | password | buyer |
| admin@craftly.test | admin123 | admin |

Or create new user via registration form

---

## 🔍 DEBUG MODE

To see detailed logs, check DevTools Console:

```javascript
// Look for these messages:
[AUTH] Registering user: johndoe@gmail.com to http://localhost:4002/auth/register
[AUTH] Registration successful

// Or errors:
[AUTH] Registration error: Error: User already exists
[AUTH] Login error: Error: Invalid email or password
```

---

## 📝 QUICK REFERENCE

| Component | Port | URL |
|-----------|------|-----|
| Backend | 4002 | http://localhost:4002 |
| Frontend | 5173 | http://localhost:5173 |
| Auth Register | 4002 | http://localhost:4002/auth/register |
| Auth Login | 4002 | http://localhost:4002/auth/login |
| Frontend Signup | 5173 | http://localhost:5173/signup |
| Frontend Signin | 5173 | http://localhost:5173/signin |

---

## 🚀 NEXT STEPS

1. **Immediate**: Test registration & login following steps above
2. **If working**: Proceed to buyer marketplace features
3. **If not working**: Check troubleshooting section
4. **Always**: Check DevTools (Network + Console) before asking for help

---

## 💡 COMMON PITFALLS

❌ **Backend running on 4000, frontend pointing to 4002**
- Fix: Restart backend or update .env

❌ **CORS not configured**
- Fix: Restart backend after CORS fix

❌ **Using relative URLs**
- Fix: Use full URLs like `http://localhost:4002/auth/register`

❌ **express.json() not enabled**
- Fix: Already enabled in backend

❌ **Environment variable not loaded**
- Fix: Restart dev server after .env change

---

**✅ All fixes applied. Ready to test!**
