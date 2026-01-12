# 🎨 Craftly Marketplace

A modern handmade crafts marketplace web application built with React, Node.js, and Express. Perfect for learning full-stack web development with MVVM architecture.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-2.0-orange)

---

## 📚 Table of Contents
- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 About the Project

**Craftly** is a full-stack marketplace application where users can:
- Register and create accounts
- Browse handmade crafts
- Add items to cart
- Place orders
- Manage their account and orders
- Become a seller and manage products

This project demonstrates:
- ✅ **MVVM Architecture** (Model-View-ViewModel)
- ✅ **Full-Stack Development** (Frontend + Backend)
- ✅ **JWT Authentication** (secure user sessions)
- ✅ **State Management** (React hooks + custom ViewModels)
- ✅ **REST API** (RESTful design)
- ✅ **Modern UI/UX** (Tailwind CSS)

**Perfect for:** Learning, portfolio projects, or as a starter template.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|---|---|---|
| **React** | UI library | 18.2.0 |
| **Vite** | Build tool & dev server | 5.0.0 |
| **React Router** | Client-side routing | 7.11.0 |
| **Tailwind CSS** | Styling | 4.1.18 |
| **JavaScript (ES6+)** | Language | - |

### Backend
| Technology | Purpose | Version |
|---|---|---|
| **Node.js** | Runtime | 16+ |
| **Express** | Web framework | 4.18.2 |
| **JWT** | Authentication | 9.0.0 |
| **bcryptjs** | Password hashing | 2.4.3 |
| **MySQL** | Database | 3.6.0 |
| **dotenv** | Environment config | 16.3.1 |

### Database
- **MySQL** (for production)
- **In-memory storage** (for demo/testing)

### Development Tools
- **Git** — Version control
- **npm/yarn** — Package management
- **VS Code** — Development IDE (recommended)
- **Postman** — API testing (optional)

---

## ✨ Features

### User Management
- ✅ User registration with email validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcryptjs
- ✅ Profile management
- ✅ Session persistence (localStorage)
- ✅ Auto-logout on token expiry

### Shopping Features
- ✅ Browse all available crafts
- ✅ View detailed product information
- ✅ Add items to shopping cart
- ✅ Manage cart (update quantity, remove items)
- ✅ Place orders
- ✅ View order history

### Seller Features
- ✅ Become a seller
- ✅ Create and manage products
- ✅ View orders for your products
- ✅ Track sales and inventory

### Admin Features
- ✅ User management
- ✅ Product management
- ✅ Order monitoring

### Technical Features
- ✅ Responsive design (mobile-friendly)
- ✅ Protected routes (authentication required)
- ✅ Error handling and validation
- ✅ Loading states and user feedback
- ✅ Clean, documented code with comments
- ✅ MVVM architecture for scalability

---

## 🏗️ Architecture

### MVVM Pattern (Model-View-ViewModel)

```
┌─────────────────────────────────────────────┐
│           FRONTEND (React)                  │
├─────────────────────────────────────────────┤
│  Views/Components                           │
│  (pages/, components/)                      │
│         ↑                                   │
│         │ Uses                              │
│         ↓                                   │
│  ViewModels (custom hooks)                  │
│  (viewModels/)                              │
│         ↑                                   │
│         │ Calls                             │
│         ↓                                   │
│  Services/Models (API calls)                │
│  (services/, api/)                          │
└──────────────────────────────────────────────┘
           ↕ HTTP (REST API)
┌──────────────────────────────────────────────┐
│           BACKEND (Node.js)                  │
├──────────────────────────────────────────────┤
│  Routes                                      │
│  (routes/)                                   │
│         ↑                                    │
│         │ Routes to                          │
│         ↓                                    │
│  Controllers                                 │
│  (controllers/)                              │
│         ↑                                    │
│         │ Uses                               │
│         ↓                                    │
│  Models (business logic & data)              │
│  (models/)                                   │
│         ↑                                    │
│         │ Accesses                           │
│         ↓                                    │
│  Database (MySQL)                            │
│  (migrations/)                               │
└──────────────────────────────────────────────┘
```

### Layer Responsibilities

**Frontend:**
- **Views** — Display UI to users
- **ViewModels** — Manage state, fetch data, handle business logic
- **Services** — Make API calls, handle authentication

**Backend:**
- **Routes** — Define API endpoints
- **Controllers** — Handle requests, validate input
- **Models** — Database queries, business logic
- **Middleware** — Authentication, error handling

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ ([download](https://nodejs.org))
- npm (comes with Node.js)
- Git (optional, for cloning)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jerigonzalesup-spec/Craftly.git
cd Craftly
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies** (new terminal)
```bash
cd client
npm install
```

4. **Create environment files**

Create `backend/.env`:
```env
PORT=4002
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=craftly_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

Create `client/.env.local`:
```env
VITE_API_URL=http://localhost:4002/api
```

### Running the Application

**Terminal 1 — Start Backend:**
```bash
cd backend
npm run start
```
✅ Backend will run on `http://localhost:4002`

**Terminal 2 — Start Frontend:**
```bash
cd client
npm run dev
```
✅ Frontend will run on `http://localhost:5173`

3. **Open in Browser**
```
http://localhost:5173
```

4. **Test the App**
- Click "Sign Up" to create an account, OR
- Use demo credentials:
  - Email: `demo@craftly.test`
  - Password: `password`

---

## 📁 Project Structure

```
Craftly/
├── README.md                    # Project overview (this file)
├── DEPLOYMENT_GUIDE.md          # How to run on different devices/platforms
├── TECH_STACK.md                # Detailed technology information
│
├── backend/                     # Node.js/Express API (port 4002)
│   ├── index.js                 # Server entry point
│   ├── package.json             # Backend dependencies
│   ├── README.md                # Backend-specific guide
│   │
│   ├── migrations/              # Database migrations
│   │   └── init.sql             # Schema: create tables
│   │
│   ├── scripts/                 # Helper scripts
│   │   ├── seed_demo.js         # Add sample data
│   │   ├── reset_db.js          # Reset database
│   │   └── ...
│   │
│   └── src/
│       ├── app.js               # Express app setup
│       │
│       ├── config/              # Configuration
│       │   ├── database.js       # MySQL pool
│       │   ├── jwt.js            # JWT secrets
│       │   └── mongo.js          # MongoDB (optional)
│       │
│       ├── controllers/          # Request handlers
│       │   ├── auth.controller.js        # Login/register logic
│       │   ├── craft.controller.js       # Product operations
│       │   ├── order.controller.js       # Order management
│       │   ├── cart.controller.js        # Cart operations
│       │   └── user.controller.js        # User operations
│       │
│       ├── models/               # Data models & queries
│       │   ├── user.model.js             # User DB operations
│       │   ├── craft.model.js            # Product DB operations
│       │   ├── order.model.js            # Order DB operations
│       │   └── ...
│       │
│       ├── routes/               # API endpoints
│       │   ├── auth.routes.js            # POST /api/auth/register, /login
│       │   ├── craft.routes.js           # GET /api/crafts, POST /api/crafts
│       │   ├── order.routes.js           # POST /api/orders, GET /api/orders
│       │   ├── cart.routes.js            # GET/POST /api/cart
│       │   └── user.routes.js            # GET /api/users/me
│       │
│       ├── middleware/           # Custom middleware
│       │   ├── auth.middleware.js        # JWT token verification
│       │   └── error.middleware.js       # Global error handler
│       │
│       └── utils/                # Utilities
│           ├── logger.js         # Logging helper
│           └── response.js       # Response formatter
│
├── client/                      # React/Vite frontend (port 5173)
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite build config
│   ├── tailwind.config.js        # Tailwind CSS setup
│   ├── README.md                 # Frontend-specific guide
│   │
│   └── src/
│       ├── main.jsx              # Entry point
│       ├── App.jsx               # Root component + routing
│       ├── index.css              # Global styles
│       │
│       ├── api/                  # API configuration
│       │   └── api.js            # Fetch wrapper with auth
│       │
│       ├── services/             # API services (Models)
│       │   ├── api.js            # HTTP client
│       │   ├── auth.js           # Auth service
│       │   ├── user.service.js    # User API calls
│       │   ├── order.service.js   # Order API calls
│       │   └── ...
│       │
│       ├── viewModels/           # Custom hooks (ViewModels)
│       │   ├── AuthViewModel.js   # Auth state & logic
│       │   ├── HomeViewModel.js   # Home page state
│       │   ├── OrderViewModel.js  # Order state
│       │   ├── CreateCraftViewModel.js
│       │   ├── AccountViewModel.js
│       │   └── ...
│       │
│       ├── components/           # Reusable UI components
│       │   ├── Header.jsx        # App navbar
│       │   ├── Button.jsx        # Button component
│       │   ├── Card.jsx          # Card wrapper
│       │   ├── Input.jsx         # Form input
│       │   ├── ProtectedRoute.jsx # Auth guard
│       │   └── ...
│       │
│       ├── pages/                # Full page components
│       │   ├── SignIn.jsx        # Login page
│       │   ├── SignUp.jsx        # Register page
│       │   ├── BuyerHome.jsx     # Dashboard
│       │   ├── Cart.jsx          # Shopping cart
│       │   ├── Checkout.jsx      # Checkout
│       │   ├── MyOrdersView.jsx   # User orders
│       │   ├── ProductDetails.jsx # Product page
│       │   └── ...
│       │
│       ├── context/              # React Context
│       │   └── AuthContext.jsx   # Global auth state
│       │
│       └── views/                # View components
│           ├── AccountView.jsx
│           ├── HomeView.jsx
│           └── ...
│
├── cleanup_backup/              # Removed files (safe to delete)
│   ├── backend_scripts/
│   ├── client_services/
│   └── root_scripts/
│
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
└── package.json                 # Root package (if monorepo)
```

---

## 📖 Usage Guide

### For Users
1. **Sign Up** — Create a new account with email & password
2. **Browse Products** — View all available crafts on dashboard
3. **Add to Cart** — Select items and choose quantity
4. **Checkout** — Review cart and place order
5. **View Orders** — Track your purchases and history
6. **Account** — Update profile info, become seller

### For Developers
1. **Add API Endpoint** — Create new route in `backend/src/routes/`
2. **Add Controller Logic** — Handle business logic in `backend/src/controllers/`
3. **Add Database Query** — Write DB logic in `backend/src/models/`
4. **Add Frontend Page** — Create component in `client/src/pages/`
5. **Add State Management** — Create ViewModel in `client/src/viewModels/`
6. **Add UI Component** — Build component in `client/src/components/`

### Where to Add Features

| Feature Type | Location |
|---|---|
| New API endpoint | `backend/src/routes/` |
| Database query | `backend/src/models/` |
| Business logic | `backend/src/controllers/` |
| New page | `client/src/pages/` |
| State management | `client/src/viewModels/` |
| UI component | `client/src/components/` |
| API service call | `client/src/services/` |

---

## 📱 Deployment

### Local Network (Phone/Tablet)
Run on your computer and access from phone on same WiFi:
```bash
# Find computer IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Access from phone browser
http://YOUR_COMPUTER_IP:5173
```

### Cloud Deployment
Options to deploy online:
- **Heroku** (backend)
- **Netlify / Vercel** (frontend)
- **Railway.app** (full stack)
- **Replit** (quick & easy)

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 🤝 Contributing

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code patterns
- Keep functions small and focused

### Reporting Issues
If you find a bug:
1. Check if it's already reported
2. Create a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.

---

## 📞 Support & Questions

- 📖 Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for setup help
- 🔧 See [TECH_STACK.md](TECH_STACK.md) for detailed tech info
- 💬 Open an issue for questions or bug reports
- 🌐 Visit the [GitHub repo](https://github.com/jerigonzalesup-spec/Craftly)

---

## 🎉 Acknowledgments

Built as a full-stack learning project demonstrating:
- MVVM architecture patterns
- React best practices
- Node.js/Express backend development
- JWT authentication & security
- RESTful API design
- Professional project structure

**Made with ❤️ by Craftly Team**

---

**Last Updated:** January 12, 2026  
**Version:** 2.0  
**Status:** ✅ Production Ready
