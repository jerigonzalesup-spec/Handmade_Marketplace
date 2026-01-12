# 🎨 Craftly Frontend

React + Vite + Tailwind CSS frontend for the Craftly marketplace. Uses MVVM architecture with custom ViewModels for state management.

---

## 📚 Overview

**Port:** 5173 (Vite dev server)  
**Framework:** React 18  
**Build Tool:** Vite  
**Styling:** Tailwind CSS  
**Routing:** React Router v7  
**Architecture:** MVVM (Model-View-ViewModel)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env.local` file
```env
VITE_API_URL=http://localhost:4002/api
```

### 3. Run Dev Server
```bash
npm run dev
```

Open browser to: `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🏗️ Project Structure

```
client/src/
├── main.jsx                 # Entry point
├── App.jsx                  # Root component + routing
├── index.css                # Global styles
│
├── api/                     # API configuration
│   └── api.js               # Fetch wrapper with auth
│
├── services/                # API services (Models)
│   ├── api.js               # Generic HTTP client
│   ├── auth.js              # Auth service (login, logout)
│   ├── user.service.js      # User API calls
│   ├── order.service.js     # Order API calls
│   └── ...
│
├── viewModels/              # Custom hooks (MVVM - ViewModel)
│   ├── AuthViewModel.js     # Auth state & logic
│   ├── HomeViewModel.js     # Home page state
│   ├── OrderViewModel.js    # Order state
│   ├── CreateCraftViewModel.js
│   ├── AccountViewModel.js
│   └── ...
│
├── components/              # Reusable UI components (View)
│   ├── Header.jsx           # App navbar
│   ├── Button.jsx           # Button component
│   ├── Card.jsx             # Card wrapper
│   ├── Input.jsx            # Form input
│   ├── ProtectedRoute.jsx   # Auth guard component
│   ├── AdminRoute.jsx        # Admin guard
│   ├── Layout.jsx            # Page layout wrapper
│   └── ...
│
├── pages/                   # Full page components (View)
│   ├── SignIn.jsx           # Login page
│   ├── SignUp.jsx           # Register page
│   ├── BuyerHome.jsx        # Buyer dashboard
│   ├── Cart.jsx             # Shopping cart
│   ├── Checkout.jsx         # Checkout page
│   ├── MyOrdersView.jsx     # User orders page
│   ├── ProductDetails.jsx   # Product detail page
│   ├── BrowseProducts.jsx   # Product listing
│   └── ...
│
├── context/                 # React Context (global state)
│   └── AuthContext.jsx      # Global auth provider
│
└── views/                   # Alternative view components
    ├── AccountView.jsx
    ├── HomeView.jsx
    └── ...
```

---

## 🏛️ MVVM Architecture

### Layer Breakdown

**View (Components & Pages)**
- Display UI to users
- Receive user input
- Call ViewModel methods
- Show data from ViewModel

**ViewModel (Custom Hooks)**
- Manage component state
- Fetch data from Services
- Handle business logic
- Provide methods for Views

**Model (Services)**
- Make API calls to backend
- Handle authentication
- Pure data operations
- No UI logic

### Example Flow
```
1. User clicks "Submit" button in ProductCard component
2. Component calls ViewModel: createCraft(data)
3. ViewModel calls Service: api.post('/crafts', data)
4. Service makes HTTP request to backend
5. Backend returns response
6. ViewModel updates state
7. Component re-renders with new data
```

---

## 🎯 Key Features

### Authentication
- Register new users
- Login with email/password
- JWT token storage (localStorage)
- Auto-logout on token expiry
- Protected routes

### Shopping
- Browse products
- Add to cart
- Manage cart items
- Place orders
- View order history

### Seller Features
- Become seller
- Create products
- Manage products
- View sales

### Admin Features
- User management
- Product management
- Order monitoring

---

## 📝 How to Add Features

### Add New Page

1. **Create ViewModel** (`src/viewModels/YourViewModel.js`):
```javascript
// YourViewModel.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useYourViewModel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/your-endpoint');
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, load };
}
```

2. **Create Page Component** (`src/pages/YourPage.jsx`):
```javascript
// YourPage.jsx
import useYourViewModel from '../viewModels/YourViewModel';

export default function YourPage() {
  const { data, loading, error, load } = useYourViewModel();

  useEffect(() => { load(); }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

3. **Add Route** (in `src/App.jsx`):
```javascript
import YourPage from './pages/YourPage';

function App() {
  return (
    <Routes>
      <Route path="/your-page" element={<YourPage />} />
    </Routes>
  );
}
```

### Add New Component

Create in `src/components/YourComponent.jsx`:
```javascript
export default function YourComponent({ title, children }) {
  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </div>
  );
}
```

Use in pages:
```javascript
<YourComponent title="My Title">
  <p>Content here</p>
</YourComponent>
```

### Add New Service

Create in `src/services/yourservice.js`:
```javascript
import api from './api';

export async function getYourData() {
  return api.get('/your-endpoint');
}

export async function createYourData(data) {
  return api.post('/your-endpoint', data);
}

export default { getYourData, createYourData };
```

---

## 🔐 Authentication

### How It Works
1. User logs in via `/auth/login` endpoint
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. API service adds token to all requests: `Authorization: Bearer <token>`
5. Protected routes check token and redirect if missing

### Protected Routes
Wrap components in `ProtectedRoute`:
```javascript
import ProtectedRoute from './components/ProtectedRoute';

<Routes>
  <Route path="/login" element={<SignIn />} />
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } 
  />
</Routes>
```

---

## 🎨 Styling with Tailwind CSS

### Global Styles
Edit `src/index.css` for global styles

### Component Styling
Use Tailwind classes directly in JSX:
```javascript
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Click me
</button>
```

### Configuration
Tailwind config: `tailwind.config.js`  
PostCSS config: `postcss.config.js`

---

## 📦 Dependencies

Key dependencies (see `package.json`):
- `react` — UI library
- `react-dom` — DOM rendering
- `react-router-dom` — Client routing
- `vite` — Build tool
- `tailwindcss` — Styling

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Can sign up with new account
- [ ] Can login with credentials
- [ ] Token persists after page refresh
- [ ] Protected pages redirect to login when not authenticated
- [ ] Can browse products
- [ ] Can add products to cart
- [ ] Can place order
- [ ] Can view order history
- [ ] Mobile responsive layout works

### Browser DevTools Tips
1. Open F12 or Ctrl+Shift+I
2. Check Console for errors
3. Check Network tab for API calls
4. Check Application → localStorage for token
5. Check React DevTools extension

---

## 🚀 Environment Variables

### Available Variables
```env
VITE_API_URL      # Backend API URL (required)
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 📱 Responsive Design

Uses Tailwind CSS breakpoints:
- `sm` — Small screens (640px)
- `md` — Medium (768px)
- `lg` — Large (1024px)
- `xl` — Extra large (1280px)

Example:
```javascript
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

---

## 🐛 Troubleshooting

### API calls return 404?
- Check backend is running on port 4002
- Verify `VITE_API_URL` in `.env.local`
- Check API endpoint exists

### Token not being sent?
- Check localStorage for token (DevTools → Application)
- Verify `auth.js` adds Authorization header
- Check token not expired

### Styles not loading?
- Clear browser cache (Ctrl+Shift+Delete)
- Rebuild: `npm run build`
- Check Tailwind config

### Module not found?
- Run `npm install`
- Check import paths are correct
- Verify file exists

---

## ✅ Verification Checklist

- [ ] Node.js installed
- [ ] `npm install` completed
- [ ] `.env.local` created with API_URL
- [ ] Backend running on port 4002
- [ ] `npm run dev` starts successfully
- [ ] Can access `http://localhost:5173`
- [ ] Can see landing page
- [ ] Can navigate to login
- [ ] Can create new account
- [ ] Can login successfully

---

**Last Updated:** January 12, 2026  
**Version:** 2.0  
**Status:** ✅ Production Ready

