# 🔧 Craftly Backend API

Node.js/Express REST API for the Craftly marketplace. Handles authentication, product management, orders, and user operations.

---

## 📚 Overview

**Port:** 4002  
**Base URL:** `http://localhost:4002/api`  
**Auth:** JWT (Bearer Token)  
**Database:** MySQL

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env` file
```env
PORT=4002
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=craftly_db
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Run Server
```bash
npm run start
```

Expected output:
```
Backend running on http://localhost:4002
API base: http://localhost:4002/api
```

---

## 📡 API Endpoints

All endpoints are prefixed with `/api`

### Authentication
```
POST   /auth/register     - Create new user account
POST   /auth/login        - Login user (returns JWT token)
GET    /auth/me           - Get current user (requires token)
```

### Products/Crafts
```
GET    /crafts            - Get all products
POST   /crafts            - Create new product (seller only)
GET    /crafts/:id        - Get product details
PUT    /crafts/:id        - Update product (seller only)
DELETE /crafts/:id        - Delete product (seller only)
```

### Orders
```
POST   /orders            - Create new order
GET    /orders            - Get all orders (admin)
GET    /orders/my         - Get user's orders
GET    /orders/:id        - Get order details
```

### Cart
```
GET    /cart              - Get user's cart
POST   /cart              - Add to cart
PUT    /cart/items/:id    - Update cart item
DELETE /cart/items/:id    - Remove from cart
```

### Users
```
GET    /users/me          - Get current user profile
PUT    /users/me          - Update user profile
POST   /users/become-seller - Convert user to seller
```

---

## 🏗️ Project Structure

```
backend/
├── index.js                      # Server entry point
├── package.json                  # Dependencies
├── .env.example                  # Environment template
├── README.md                     # This file
│
├── src/
│   ├── app.js                    # Express app setup
│   │
│   ├── config/                   # Configuration
│   │   ├── database.js           # MySQL pool
│   │   ├── jwt.js                # JWT secrets
│   │   └── mongo.js              # MongoDB (optional)
│   │
│   ├── controllers/              # Request handlers
│   │   ├── auth.controller.js    # Login/register logic
│   │   ├── craft.controller.js   # Product operations
│   │   ├── order.controller.js   # Order operations
│   │   ├── cart.controller.js    # Cart operations
│   │   └── user.controller.js    # User operations
│   │
│   ├── models/                   # Data models & queries
│   │   ├── user.model.js         # User DB operations
│   │   ├── craft.model.js        # Product DB operations
│   │   ├── order.model.js        # Order DB operations
│   │   └── ...
│   │
│   ├── routes/                   # API endpoints
│   │   ├── auth.routes.js        # Auth endpoints
│   │   ├── craft.routes.js       # Product endpoints
│   │   ├── order.routes.js       # Order endpoints
│   │   ├── cart.routes.js        # Cart endpoints
│   │   └── user.routes.js        # User endpoints
│   │
│   ├── middleware/               # Custom middleware
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── error.middleware.js   # Error handling
│   │
│   └── utils/                    # Utilities
│       ├── logger.js             # Logging
│       └── response.js           # Response formatter
│
├── migrations/                   # Database migrations
│   ├── init.sql                  # Initial schema
│   └── reset.sql                 # Database reset
│
└── scripts/                      # Helper scripts
    ├── seed_demo.js              # Add sample data
    ├── reset_db.js               # Reset database
    ├── repair_schema.js           # Fix schema issues
    └── ...
```

---

## 🔐 Authentication

### JWT Token Flow
1. User sends email & password to `/auth/login`
2. Server validates and returns JWT token
3. Frontend stores token in localStorage
4. Frontend sends token in `Authorization: Bearer <token>` header
5. Backend middleware (`auth.middleware.js`) verifies token

### Protected Routes
Add middleware to routes:
```javascript
import authMiddleware from '../middleware/auth.middleware.js';

router.get('/protected-route', authMiddleware, (req, res) => {
  // req.user contains decoded token
  res.json({ user: req.user });
});
```

---

## 💾 Database

### Schema
Tables: `users`, `crafts`, `orders`, `order_items`, `carts`, `cart_items`

Run migrations on startup (automatic in `config/database.js`)

### Manual DB Operations
```bash
# Reset database
npm run reset-db

# Seed demo data
npm run seed

# Repair schema (add missing columns)
npm run repair
```

---

## 📝 Environment Variables

```env
PORT                    # Server port (default: 4002)
MYSQL_HOST             # Database host
MYSQL_USER             # Database user
MYSQL_PASSWORD         # Database password
MYSQL_DATABASE         # Database name
JWT_SECRET             # Secret key for JWT signing
JWT_EXPIRES_IN         # Token expiration (e.g., "7d")
NODE_ENV               # development | production
```

---

## 🧪 Testing Endpoints

### Register
```bash
curl -X POST http://localhost:4002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass123","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:4002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass123"}'
```

### Get Current User (requires token)
```bash
curl -X GET http://localhost:4002/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get All Crafts
```bash
curl -X GET http://localhost:4002/api/crafts
```

---

## 🛠️ Adding New Features

### Add New API Endpoint

1. **Create Route** (`src/routes/newfeature.routes.js`):
```javascript
import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import * as controller from '../controllers/newfeature.controller.js';

const router = express.Router();
router.post('/', authMiddleware, controller.create);
router.get('/', controller.getAll);

export default router;
```

2. **Create Controller** (`src/controllers/newfeature.controller.js`):
```javascript
export const create = async (req, res) => {
  try {
    // Your logic here
    res.status(201).json({ message: 'Created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

3. **Create Model** (`src/models/newfeature.model.js`):
```javascript
// Database operations here
export const findAll = async () => {
  const query = 'SELECT * FROM newfeatures';
  const [rows] = await pool.query(query);
  return rows;
};
```

4. **Register Route** (in `src/app.js`):
```javascript
import newFeatureRoutes from './routes/newfeature.routes.js';
app.use('/api/newfeature', newFeatureRoutes);
```

---

## 🐛 Troubleshooting

### Port 4002 in use?
```bash
# Find process using port
netstat -ano | findstr :4002  # Windows
lsof -i :4002                 # Mac/Linux

# Kill process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Mac/Linux
```

### Database connection error?
- Check MySQL is running
- Verify `.env` credentials
- Check MYSQL_DATABASE exists

### JWT errors?
- Token might be expired
- Check JWT_SECRET in `.env`
- Frontend token might be corrupted

---

## 📦 Dependencies

See `package.json` for all dependencies. Key ones:
- `express` — Web framework
- `jsonwebtoken` — JWT handling
- `bcryptjs` — Password hashing
- `mysql2` — Database driver
- `cors` — Cross-origin requests
- `dotenv` — Environment variables

---

## ✅ Verification Checklist

- [ ] Node.js installed
- [ ] MySQL running
- [ ] `.env` file created
- [ ] `npm install` completed
- [ ] `npm start` runs without errors
- [ ] Can access `http://localhost:4002/api/health`
- [ ] Can register new user
- [ ] Can login
- [ ] Can fetch protected endpoints with token

---

**Last Updated:** January 12, 2026  
**Version:** 2.0  
**Status:** ✅ Production Ready

