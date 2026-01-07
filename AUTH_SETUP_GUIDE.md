# CRAFTLY - AUTHENTICATION SETUP & TESTING GUIDE

**Status**: ✅ READY TO TEST  
**Date**: January 7, 2026

---

## 🎯 QUICK START (5 minutes)

### Terminal 1 - Start Backend
```bash
cd C:\Users\gonza\Craftly\backend
npm start
```

**Expected Output**:
```
✅ Craftly server running on http://localhost:4002
```

### Terminal 2 - Start Frontend
```bash
cd C:\Users\gonza\Craftly\client
npm run dev
```

**Expected Output**:
```
➜  Local:   http://localhost:5173/
```

### Browser - Test Registration
1. Go to: http://localhost:5173/signup
2. Fill form:
   - **Name**: John Doe
   - **Email**: johndoe (auto-appends @gmail.com)
   - **Password**: TestPass123
   - **Confirm**: TestPass123
3. Click "Create Account"
4. **Result**: ✅ Auto-redirects to /buyer

### Browser - Test Login
1. Go to: http://localhost:5173/signin
2. Fill form:
   - **Email**: demo@craftly.test
   - **Password**: password
3. Click "Sign In"
4. **Result**: ✅ Auto-redirects to /buyer

---

## 🔧 ARCHITECTURE OVERVIEW

### Backend Stack
- **Framework**: Express.js (ES Modules)
- **Port**: 4002 (auto-binds to available port)
- **Database**: In-memory (demo data)
- **Auth**: JWT + bcryptjs

### Frontend Stack
- **Framework**: React 18 + Vite
- **Port**: 5173
- **API URL**: http://localhost:4002 (from .env.development)

### Communication Flow
```
Frontend Sign Up Form
    ↓
fetch POST /auth/register (JSON)
    ↓ (over HTTP)
Backend receives request
    ↓
Validates input
    ↓
Hashes password (bcryptjs)
    ↓
Creates user
    ↓
Generates JWT token
    ↓
Returns JSON response
    ↓ (with token + user data)
Frontend receives response
    ↓
Saves token to localStorage
    ↓
Redirects to /buyer
    ✅ Done!
```

---

## 📡 API ENDPOINTS

### POST /auth/register
**Request**:
```json
{
  "email": "user@gmail.com",
  "password": "TestPass123",
  "name": "John Doe"
}
```

**Success Response (201)**:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 100,
    "email": "user@gmail.com",
    "name": "John Doe",
    "role": "buyer"
  }
}
```

**Error Responses**:
- `400`: Missing fields or invalid password (< 8 chars)
- `409`: User already exists
- `500`: Server error

---

### POST /auth/login
**Request**:
```json
{
  "email": "demo@craftly.test",
  "password": "password"
}
```

**Success Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "demo@craftly.test",
    "name": "Demo User",
    "role": "buyer"
  }
}
```

**Error Responses**:
- `400`: Missing fields
- `401`: Invalid credentials (email/password wrong)
- `500`: Server error

---

### GET /auth/me (Protected)
**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200)**:
```json
{
  "user": {
    "id": 1,
    "email": "demo@craftly.test",
    "name": "Demo User",
    "role": "buyer"
  }
}
```

**Error Response**:
- `401`: No token or invalid token

---

## 🧪 VERIFICATION CHECKLIST

### Backend
- [ ] Server starts: `npm start` → shows port 4002
- [ ] Health check: `curl http://localhost:4002/health` → `{"ok": true}`
- [ ] Register endpoint: `curl -X POST http://localhost:4002/auth/register -H "Content-Type: application/json" -d '{"email":"test@gmail.com","password":"TestPass123","name":"Test"}'`
- [ ] Login endpoint: Works with demo@craftly.test / password

### Frontend
- [ ] Dev server starts: `npm run dev` → port 5173
- [ ] .env.development: `VITE_API_URL=http://localhost:4002`
- [ ] Sign up page loads: http://localhost:5173/signup
- [ ] Sign in page loads: http://localhost:5173/signin
- [ ] No console errors (only [AUTH] logs)

### End-to-End
- [ ] Can register new user
- [ ] Redirects to /buyer after registration
- [ ] Can login with demo credentials
- [ ] Redirects to /buyer after login
- [ ] Token saved in localStorage
- [ ] User data saved in localStorage
- [ ] Page refresh - still logged in
- [ ] Logout works - redirects to /signin

---

## 🔍 TROUBLESHOOTING

### Issue: "Failed to fetch"

**Check 1: Backend Running?**
```bash
curl http://localhost:4002/health
```
If fails: `cd backend && npm start`

**Check 2: CORS Enabled?**
- Backend has: `app.use(cors({ origin: ['http://localhost:5173', ...] }))`
- If not: Restart backend after verifying CORS config

**Check 3: Frontend API URL?**
- Check `.env.development`: Should be `VITE_API_URL=http://localhost:4002`
- Check console logs: Should show `[AUTH] Registering user: ... to http://localhost:4002/auth/register`

### Issue: "User already exists" (409)

**This is expected** - use different email:
```
Change email to: newemail123@gmail.com
Or use demo user to login instead of registering
```

### Issue: "Invalid credentials" (401)

**For login**:
- ✅ Demo user: `demo@craftly.test` / `password`
- ✅ Admin user: `admin@craftly.test` / `admin123`
- ❌ Wrong password: Try again with correct password

### Issue: "Password must be at least 8 characters"

**During registration**:
- Password minimum: 8 characters
- Use: `TestPass123` (11 chars) ✅
- Don't use: `test123` (7 chars) ❌

### Issue: Console shows error but page works

**This is normal** - check for:
- `[AUTH] Registration error: ...` → Real error
- `Failed to parse JSON` → Response format issue
- `Unexpected token` → Response not JSON

---

## 📝 KEY FILES

| File | Purpose |
|------|---------|
| `backend/index.js` | Express app + CORS setup |
| `backend/src/controllers/auth.controller.js` | Register/Login/Me handlers |
| `backend/src/routes/auth.routes.js` | Route definitions |
| `client/src/services/auth.js` | Frontend auth functions |
| `client/src/pages/SignUp.jsx` | Sign up form page |
| `client/src/pages/SignIn.jsx` | Sign in form page |
| `client/.env.development` | API URL config |

---

## 🔐 SECURITY FEATURES

✅ **Passwords hashed** with bcryptjs (10 salt rounds)  
✅ **JWT tokens** signed with secret key  
✅ **CORS enabled** only for localhost:5173  
✅ **Auth middleware** protects /auth/me route  
✅ **Input validation** on both client & server  
✅ **Error messages** don't leak sensitive info  

---

## 📊 DEMO CREDENTIALS

| Email | Password | Role |
|-------|----------|------|
| demo@craftly.test | password | buyer |
| admin@craftly.test | admin123 | admin |

---

## 🚀 NEXT STEPS AFTER LOGIN

After successful login, users are redirected to `/buyer` which shows:
- ✅ Marketplace with products
- ✅ Search functionality
- ✅ Category filtering
- ✅ Shopping cart
- ✅ User profile menu
- ✅ Logout button

---

## 💡 DEVELOPMENT TIPS

### Enable Debug Logs
Browser Console (F12) will show:
```
[AUTH] Registering user: test@gmail.com to http://localhost:4002/auth/register
[AUTH] Registration successful
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Submit form
4. Look for `auth/register` or `auth/login` request
5. Check Status: `201` (register) or `200` (login)

### Check LocalStorage
1. DevTools → Application → LocalStorage
2. Look for: `authToken` (JWT) and `craftly_user` (user object)

### Test with cURL
```bash
# Register
curl -X POST http://localhost:4002/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"curl@test.com","password":"CurlTest123","name":"Curl User"}'

# Login
curl -X POST http://localhost:4002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@craftly.test","password":"password"}'
```

---

## ✅ WHAT'S INCLUDED

- [x] Backend registration endpoint
- [x] Backend login endpoint
- [x] Frontend signup form
- [x] Frontend signin form
- [x] JWT token generation
- [x] Password hashing
- [x] CORS configuration
- [x] Error handling
- [x] localStorage persistence
- [x] Protected routes
- [x] Demo users
- [x] Environment configuration

---

## ❌ NOT INCLUDED (Out of Scope)

- Email verification
- Password reset
- Social login (Google, GitHub)
- Two-factor authentication
- OAuth2
- Session management
- Token refresh

These can be added in future phases.

---

## 🎯 SUCCESS CRITERIA

✅ User can register  
✅ User can login  
✅ No "failed to fetch" errors  
✅ Token saved to localStorage  
✅ Redirects to /buyer after login  
✅ Logout works  
✅ Page refresh keeps user logged in  

---

**Ready to test!** Follow Quick Start section above.
