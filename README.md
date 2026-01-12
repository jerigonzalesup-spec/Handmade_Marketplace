# 🎨 Craftly Marketplace - Complete Setup & Architecture

**Version:** 2.0 (Consolidated & Stabilized)  
**Status:** ✅ Production-Ready  
**Last Updated:** January 7, 2026

---

## � Sharing on GitHub

### Before pushing to GitHub:
1. Update repository name and description in GitHub settings
2. Add `.env` files (never commit secrets!) — use `.env.example` as template
3. Run `npm install` on clean checkout to verify dependencies
4. Check that node_modules/ and .env are in `.gitignore`

### What to include:
- ✅ `backend/`, `client/`, `cleanup_backup/` (documentation of cleanup)
- ✅ `README.md`, `TECH_STACK.md` — setup guides
- ✅ All source files and package.json files
- ❌ Skip `node_modules/`, `.env`, `*.log` files (handled by .gitignore)

### Quick push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/craftly.git
git branch -M main
git push -u origin main
```

---

## �📋 Project Overview

Craftly is a handmade crafts marketplace web application built with:

- **Backend:** Node.js + Express + JWT Auth (in-memory users, no DB)
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Architecture:** Monorepo with single backend + single frontend
- **Deployment Ready:** Professional structure, clean code, no duplicates

### Key Features

✅ User Registration & Login (with auto-redirect to buyer dashboard)  
✅ JWT Token-based Authentication  
✅ localStorage Persistence (survives page refresh)  
✅ Protected Routes (ProtectedRoute component)  
✅ Buyer Dashboard with Product Browsing  
✅ Order Management  
✅ Account Settings  
✅ Professional UI/UX with Tailwind CSS  
✅ No Database Required (demo-ready)

---

## � Running on Different Devices

Want to run Craftly on your Windows PC, Mac, Linux, or access it from your phone?

👉 **See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for:
- Step-by-step setup for Windows, Mac, Linux
- How to access from phone/tablet on same network
- How to deploy online (Heroku, Netlify, Railway, etc.)
- Troubleshooting common issues

---

## �🚀 Quick Start (5 minutes)

### Prerequisites

- Node.js 16+ installed
- npm or yarn
- Code editor (VS Code recommended)

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd client
npm install
```

### Step 2: Start Backend

```bash
cd backend
npm start
```

**Expected Output:**
```
✅ Craftly backend running on http://localhost:4002
🔌 API base: http://localhost:4002/api
```

### Step 3: Start Frontend (new terminal)

```bash
cd client
npm run dev
```

**Expected Output:**
```
➜ Local: http://localhost:5173/
```

### Step 4: Test Authentication

1. Go to **http://localhost:5173**
2. Click "Sign Up" to create account OR
3. Click "Sign In" and use:
   - **Email:** demo@craftly.test
   - **Password:** password

---

## 🗂️ Final Project Structure

```
craftly/
├── backend/                    # ✅ ONLY Backend (port 4002)
│   ├── index.js               # Entry point, server startup
│   ├── package.json           # Dependencies
│   ├── .env                   # Environment variables
│   └── src/
│       ├── app.js             # Express app factory
│       ├── config/
│       │   ├── jwt.js         # JWT configuration
│       │   └── db.js          # DB config (if needed)
│       ├── controllers/
│       │   ├── auth.controller.js     # register, login, me
│       │   ├── craft.controller.js    # craft operations
│       │   └── ...
│       ├── middleware/
│       │   ├── auth.middleware.js     # Bearer token verification
│       │   └── error.middleware.js    # Error handler
│       ├── models/
│       │   ├── user.model.js          # In-memory user storage
│       │   ├── craft.model.js         # In-memory craft storage
│       │   └── ...
│       ├── routes/
│       │   ├── auth.routes.js         # /api/auth/*
│       │   ├── craft.routes.js        # /api/crafts/*
│       │   └── ...
│       └── utils/
│           ├── logger.js              # Console logging
│           └── response.js            # JSON response helpers
│
├── client/                     # ✅ ONLY Frontend (port 5173)
│   ├── src/
│   │   ├── main.jsx            # Entry point (wraps App with AuthProvider)
│   │   ├── App.jsx             # Main routing configuration
│   │   ├── index.css           # Global styles
│   │   ├── api/
│   │   │   └── api.js          # apiFetch() helper with Bearer token
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state (user, token, methods)
│   │   ├── services/
│   │   │   ├── auth.js         # register(), login(), logout()
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx    # Route guard (redirects if no auth)
│   │   │   ├── AuthLayout.jsx        # Auth page wrapper
│   │   │   ├── Layout.jsx            # Standard page wrapper
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx       # Public home page
│   │   │   ├── SignIn.jsx            # Login form → navigate('/buyer')
│   │   │   ├── SignUp.jsx            # Signup form → auto-login → navigate('/buyer')
│   │   │   ├── BuyerHome.jsx         # Buyer dashboard (protected)
│   │   │   ├── BrowseProducts.jsx    # Product list (protected)
│   │   │   ├── ProductDetails.jsx    # Single product view
│   │   │   ├── Cart.jsx              # Shopping cart
│   │   │   └── ...
│   │   ├── views/
│   │   │   ├── MyOrdersView.jsx      # User's orders (protected)
│   │   │   ├── AccountView.jsx       # Account settings (protected)
│   │   │   └── ...
│   │   └── viewModels/
│   │       └── ...
│   ├── index.html              # HTML entry point (Vite)
│   ├── package.json            # Dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   └── postcss.config.js        # PostCSS config
│
├── server/                     # ⚠️  DEPRECATED
│   └── .DEPRECATED             # See this file for info
│
├── frontend/                   # ⚠️  DEPRECATED
│   └── .DEPRECATED             # See this file for info
│
├── .gitignore
└── README.md                   # ← You are here
```

---

## 🔐 Authentication Flow
│
├─ client/                  ← FRONTEND (port 5173)
│  ├─ package.json
│  └─ src/
│     ├─ api/api.js         ← API base: http://localhost:4002/api
│     ├─ services/auth.js
│     ├─ context/AuthContext.jsx
│     ├─ pages/
│     ├─ App.jsx
│     └─ main.jsx
│
├─ server/                  ⚠️ DEPRECATED (ignore or delete)
│  └─ .DEPRECATED
│
├─ frontend/                ⚠️ OLD (ignore or delete)
│
└─ README.md (this file)
```

---

## ✅ Verification

### Backend Running?
```bash
curl http://localhost:4002/api/health
```
Expected: `{"ok":true}`

### Register Works?
```bash
curl -X POST http://localhost:4002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass123","name":"Test"}'
```
Expected: `{"token":"...","user":{...},"message":"..."}`

### Login Works?
```bash
curl -X POST http://localhost:4002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@craftly.test","password":"password"}'
```
Expected: `{"token":"...","user":{...}}`

---

## 🔧 Configuration

### Backend (.env)
Create `backend/.env`:
```env
PORT=4002
JWT_SECRET=change-this-to-something-secret
JWT_EXPIRES_IN=7d
```

---

## 📡 API Endpoints

All under `/api`:

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | No | Create new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | ✅ | Get current user |

---

## 🛠️ Troubleshooting

**"Failed to fetch" in browser?**
1. ✅ Backend running on port 4002? → `curl http://localhost:4002/api/health`
2. ✅ Frontend API base correct? → Check `client/src/api/api.js` (should be `http://localhost:4002/api`)
3. ✅ CORS enabled? → Check `backend/src/app.js`

**Port 4002 in use?**
- Backend auto-binds to 4003, 4004, etc.
- Check console for actual port

**Dependencies missing?**
- `cd backend && npm install`
- `cd client && npm install`

---

## 📦 Key Changes

✅ **Single Backend** — All logic at `/backend`  
✅ **Port 4002** — Consistent server port  
✅ **Routes at /api** — All endpoints under `/api/*`  
✅ **CORS Enabled** — Frontend can reach backend  
✅ **JWT Auth** — Secure register/login  
✅ **Frontend Updated** — Uses `http://localhost:4002/api`  

---

## 🧹 Cleanup (Optional)

Delete deprecated folders:
```bash
rm -r server       # Mac/Linux
rm -r frontend     # Mac/Linux

rmdir /s server    # Windows
rmdir /s frontend  # Windows
```

---

**Version:** 1.0.0 - Consolidated  
**Last Updated:** 2024  
**Status:** Ready for Testing
