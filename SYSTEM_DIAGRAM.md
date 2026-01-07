# CRAFTLY AUTHENTICATION - COMPLETE SYSTEM DIAGRAM

## 🏗️ SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                    CRAFTLY MARKETPLACE                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐      ┌──────────────────────────────┐
│     FRONTEND (React)         │      │    BACKEND (Express)        │
│    Port 5173                 │      │    Port 4002                │
├──────────────────────────────┤      ├──────────────────────────────┤
│                              │      │                              │
│  SignUp.jsx                  │      │  /auth/register (POST)       │
│  └─ Register form            │◄────►│  ├─ Validate input          │
│                              │      │  ├─ Hash password (bcrypt)  │
│  SignIn.jsx                  │      │  ├─ Create user             │
│  └─ Login form               │◄────►│  ├─ Generate JWT            │
│                              │      │  └─ Return {token, user}    │
│  auth.js (Service)           │      │                              │
│  └─ register()               │      │  /auth/login (POST)         │
│  └─ login()                  │      │  ├─ Find user by email      │
│  └─ logout()                 │◄────►│  ├─ Compare password        │
│  └─ getToken()               │      │  ├─ Generate JWT            │
│  └─ getCurrentUser()          │      │  └─ Return {token, user}    │
│                              │      │                              │
│  localStorage                │      │  /auth/me (GET - Protected)  │
│  ├─ authToken               │      │  └─ Return {user}           │
│  └─ craftly_user             │      │                              │
│                              │      │  bcryptjs (Password Hash)    │
│                              │      │  jsonwebtoken (JWT)          │
│                              │      │                              │
└──────────────────────────────┘      └──────────────────────────────┘
         HTTP/CORS                            Database
         localhost:5173                    (In-Memory)
```

---

## 📱 USER FLOW - REGISTRATION

```
START
  │
  ├─ User opens: http://localhost:5173/signup
  │
  ├─ Sees SignUp form with fields:
  │  ├─ Name (required)
  │  ├─ Email (required, email format)
  │  ├─ Password (required, min 8 chars)
  │  └─ Confirm Password (required, match)
  │
  ├─ User fills form and clicks "Create Account"
  │
  ├─ Frontend validates:
  │  ├─ All fields present? ✅
  │  ├─ Valid email format? ✅
  │  ├─ Password >= 8 chars? ✅
  │  └─ Passwords match? ✅
  │
  ├─ Frontend sends POST request:
  │  URL: http://localhost:4002/auth/register
  │  Body: {
  │    email: "johndoe@gmail.com",
  │    password: "TestPass123",
  │    name: "John Doe"
  │  }
  │
  ├─ Backend receives request
  │
  ├─ Backend validates:
  │  ├─ Email format valid? ✅
  │  ├─ Password length >= 8? ✅
  │  ├─ User doesn't already exist? ✅
  │
  ├─ Backend processes:
  │  ├─ Hash password (bcryptjs, 10 rounds) → $2b$10$...
  │  ├─ Create user object
  │  ├─ Generate JWT token
  │  ├─ Prepare response
  │
  ├─ Backend sends response (201):
  │  {
  │    message: "User registered successfully",
  │    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  │    user: {
  │      id: 123,
  │      email: "johndoe@gmail.com",
  │      name: "John Doe",
  │      role: "buyer"
  │    }
  │  }
  │
  ├─ Frontend receives response:
  │  ├─ Check: response.ok? ✅
  │  ├─ Save to localStorage:
  │  │  ├─ authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  │  │  └─ craftly_user = {id, email, name, role}
  │  └─ Navigate to /buyer
  │
  ├─ /buyer page loads
  │  ├─ Check: Has token? ✅ (from localStorage)
  │  ├─ Allow access ✅
  │  └─ Show marketplace
  │
  └─ SUCCESS ✅
```

---

## 📱 USER FLOW - LOGIN

```
START
  │
  ├─ User opens: http://localhost:5173/signin
  │
  ├─ Sees SignIn form with fields:
  │  ├─ Email (required)
  │  └─ Password (required)
  │
  ├─ User fills form and clicks "Sign In"
  │
  ├─ Frontend validates:
  │  ├─ Email present? ✅
  │  └─ Password present? ✅
  │
  ├─ Frontend sends POST request:
  │  URL: http://localhost:4002/auth/login
  │  Body: {
  │    email: "demo@craftly.test",
  │    password: "password"
  │  }
  │
  ├─ Backend receives request
  │
  ├─ Backend searches for user by email
  │  └─ Found: demo@craftly.test ✅
  │
  ├─ Backend compares passwords:
  │  ├─ Input: "password"
  │  ├─ Stored: $2b$10$... (hashed)
  │  ├─ bcryptjs.compare() returns: true ✅
  │
  ├─ Backend generates JWT token
  │
  ├─ Backend sends response (200):
  │  {
  │    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  │    user: {
  │      id: 1,
  │      email: "demo@craftly.test",
  │      name: "Demo User",
  │      role: "buyer"
  │    }
  │  }
  │
  ├─ Frontend receives response:
  │  ├─ Check: response.ok? ✅
  │  ├─ Save to localStorage:
  │  │  ├─ authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  │  │  └─ craftly_user = {id, email, name, role}
  │  └─ Navigate to /buyer
  │
  ├─ /buyer page loads
  │  ├─ Check: Has token? ✅ (from localStorage)
  │  ├─ Allow access ✅
  │  └─ Show marketplace
  │
  └─ SUCCESS ✅
```

---

## 🔐 PASSWORD FLOW

```
REGISTRATION - Password Hashing:

1. User enters: "TestPass123"
                  │
                  ├─ Frontend validation (8+ chars) ✅
                  │
2. Frontend sends to backend as plain text (HTTPS in production)
                  │
3. Backend receives: "TestPass123"
                  │
4. Backend uses bcryptjs:
   └─ bcryptjs.hash("TestPass123", 10)
      │
      ├─ Generate salt (10 rounds)
      ├─ Hash password with salt
      └─ Result: "$2b$10$H8q8gE8P8V7Z3K1X5Q0aYe4..." (61 chars)
      │
5. Store in database: "$2b$10$H8q8gE8P8V7Z3K1X5Q0aYe4..."
                  │

LOGIN - Password Comparison:

1. User enters: "TestPass123"
                  │
2. Frontend sends to backend as plain text (HTTPS in production)
                  │
3. Backend receives: "TestPass123"
                  │
4. Backend retrieves stored hash: "$2b$10$H8q8gE8P8V7Z3K1X5Q0aYe4..."
                  │
5. Backend uses bcryptjs:
   └─ bcryptjs.compare("TestPass123", "$2b$10$H8q8gE8P8V7Z3K1X5Q0aYe4...")
      │
      ├─ Apply same salt
      ├─ Hash provided password
      ├─ Compare hashes
      └─ Result: true ✅ or false ❌
      │
6. If true → Generate JWT token → Login successful ✅
7. If false → Return 401 error → Login failed ❌
```

---

## 🎫 JWT TOKEN STRUCTURE

```
JSON Web Token (JWT):

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwi
ZW1haWwiOiJkZW1vQGNyYWZ0bHkudGVzdCIsIm5hbWUiOiJEZW
1vIFVzZXIiLCJyb2xlIjoiYnV5ZXIiLCJpYXQiOjE3MzY0NTg3
M35fX.5Y8Gz9K_L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z


Decoded Parts:

HEADER (Algorithm & Type):
{
  "alg": "HS256",
  "typ": "JWT"
}

PAYLOAD (User Data):
{
  "id": 1,
  "email": "demo@craftly.test",
  "name": "Demo User",
  "role": "buyer",
  "iat": 1736458735
}

SIGNATURE:
HMACSHA256(
  base64(HEADER) + "." + base64(PAYLOAD),
  "your-secret-key"
)

When to use:
- Send with Authorization header:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

- Backend validates signature
- Backend extracts user info
- Backend authorizes request
```

---

## 📊 ERROR CODES

```
REGISTRATION:

400 Bad Request
  ├─ Missing email, password, or name
  ├─ Invalid email format
  ├─ Password < 8 characters
  └─ Example: "Email is required"

409 Conflict
  ├─ User already exists with that email
  └─ Example: "User already exists"

500 Internal Server Error
  └─ Server error (unexpected)


LOGIN:

400 Bad Request
  ├─ Missing email or password
  └─ Example: "Email and password are required"

401 Unauthorized
  ├─ Invalid email (user not found)
  ├─ Invalid password (wrong password)
  └─ Example: "Invalid credentials"

500 Internal Server Error
  └─ Server error (unexpected)


PROTECTED ROUTE (/auth/me):

401 Unauthorized
  ├─ No Authorization header
  ├─ Invalid token format
  ├─ Invalid token signature
  ├─ Token expired
  └─ Example: "Invalid or missing token"
```

---

## 🔄 CORS FLOW

```
Frontend (http://localhost:5173) makes request to Backend (http://localhost:4002)

1. Browser: "Can I make this request?"
   └─ Same origin? NO (different ports)
   └─ Need CORS check ✅
   │
2. Browser sends CORS preflight (OPTIONS):
   OPTIONS /auth/register
   Origin: http://localhost:5173
   │
3. Backend CORS middleware checks:
   "Is http://localhost:5173 allowed?"
   └─ Check whitelist: ['http://localhost:5173', 'http://localhost:3000']
   └─ Found! ✅
   │
4. Backend responds:
   Access-Control-Allow-Origin: http://localhost:5173
   Access-Control-Allow-Credentials: true
   Access-Control-Allow-Methods: POST, GET, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   │
5. Browser: "Allowed! ✅"
   │
6. Browser sends actual request:
   POST /auth/register
   │
7. Backend processes and responds
   │
8. Browser: "Response received" ✅
```

---

## 🗂️ DIRECTORY STRUCTURE

```
Craftly/
│
├─ backend/
│  ├─ index.js (Express setup + CORS)
│  ├─ package.json
│  └─ src/
│     ├─ controllers/
│     │  └─ auth.controller.js (register, login, me)
│     ├─ routes/
│     │  └─ auth.routes.js (route definitions)
│     ├─ middleware/
│     │  └─ auth.middleware.js (JWT verification)
│     └─ models/
│        └─ user.model.js (User data structure)
│
└─ client/
   ├─ package.json
   ├─ .env.development (API_URL config)
   ├─ src/
   │  ├─ services/
   │  │  └─ auth.js (register, login functions)
   │  └─ pages/
   │     ├─ SignUp.jsx (registration form)
   │     ├─ SignIn.jsx (login form)
   │     └─ BuyerHome.jsx (protected marketplace)
```

---

## 🧪 REQUEST-RESPONSE EXAMPLES

### Registration Success (201)

**Request**:
```http
POST http://localhost:4002/auth/register
Content-Type: application/json

{
  "email": "newuser@gmail.com",
  "password": "SecurePass456",
  "name": "New User"
}
```

**Response**:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsImVtYWlsIjoibmV3dXNlckBnbWFpbC5jb20iLCJuYW1lIjoiTmV3IFVzZXIiLCJyb2xlIjoiYnV5ZXIifQ.kL9mM0nP1qR2sT3u4vW5xY6z",
  "user": {
    "id": 51,
    "email": "newuser@gmail.com",
    "name": "New User",
    "role": "buyer"
  }
}
```

### Login Success (200)

**Request**:
```http
POST http://localhost:4002/auth/login
Content-Type: application/json

{
  "email": "demo@craftly.test",
  "password": "password"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwi...",
  "user": {
    "id": 1,
    "email": "demo@craftly.test",
    "name": "Demo User",
    "role": "buyer"
  }
}
```

### Registration Error - User Exists (409)

**Request**:
```http
POST http://localhost:4002/auth/register
Content-Type: application/json

{
  "email": "demo@craftly.test",
  "password": "AnyPass123",
  "name": "Any Name"
}
```

**Response**:
```json
{
  "message": "User already exists"
}
```

### Login Error - Invalid Credentials (401)

**Request**:
```http
POST http://localhost:4002/auth/login
Content-Type: application/json

{
  "email": "demo@craftly.test",
  "password": "wrongpassword"
}
```

**Response**:
```json
{
  "message": "Invalid credentials"
}
```

---

## ✅ COMPLETE FLOW SUMMARY

```
┌──────────────────────────────────────────────────────────────────┐
│ USER ARRIVES AT CRAFTLY                                          │
└──────────────────────────────────────────────────────────────────┘
             │
             ├─ Check: localStorage has authToken?
             │
    ┌─── YES ──┴─────────┐
    │                   NO
    │                   │
    ▼                   ▼
┌────────────┐    ┌────────────┐
│ LOGGED IN  │    │ NOT LOGGED │
└────────────┘    └────────────┘
    │                   │
    ├─ Show /buyer     ├─ Show /signin
    ├─ Show products   ├─ Show /signup
    ├─ Allow shopping  └─ Require login
    │
    ▼
┌──────────────────────────────────────────────────────────────────┐
│ USER CLICKS "SIGN IN"                                            │
└──────────────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────────┐
│ SIGN IN FORM                                                     │
│ ├─ Email: demo@craftly.test                                     │
│ └─ Password: password                                            │
│ SUBMIT → POST /auth/login                                        │
└──────────────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────────┐
│ BACKEND PROCESSES                                                │
│ ├─ Find user by email                                            │
│ ├─ Compare password (bcryptjs)                                   │
│ ├─ Generate JWT token                                            │
│ └─ Return {token, user}                                          │
└──────────────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────────┐
│ FRONTEND RECEIVES RESPONSE                                       │
│ ├─ Save token to localStorage (authToken)                        │
│ ├─ Save user to localStorage (craftly_user)                      │
│ └─ Navigate to /buyer                                            │
└──────────────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────────┐
│ /buyer PAGE LOADS                                                │
│ ├─ Check: Has token? YES ✅                                     │
│ ├─ Display marketplace                                           │
│ └─ Allow shopping                                                │
└──────────────────────────────────────────────────────────────────┘
             │
             ▼
         SUCCESS! 🎉
```

---

**Ready to test! Start backend and frontend, then sign up/login in your browser.**
