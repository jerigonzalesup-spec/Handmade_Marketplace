import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import BrowseProducts from './pages/BrowseProducts';
import BuyerHome from './pages/BuyerHome';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import DashboardView from './views/DashboardView';
import CreateCraftView from './views/CreateCraftView';
import AccountView from './views/AccountView';
import MyOrdersView from './views/MyOrdersView';
import SellerOrdersView from './views/SellerOrdersView';
import ProductDetailsView from './views/ProductDetailsView';
import AdminDashboard from './views/admin/AdminDashboard';
import AdminUsers from './views/admin/AdminUsers';
import AdminProducts from './views/admin/AdminProducts';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AppLayout from './components/AppLayout';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth & Landing Pages (no wrapper) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/browse" element={<BrowseProducts />} />

        {/* Protected Buyer Pages (outside Layout) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/buyer" element={<BuyerHome />} />
          <Route path="/buyer/products" element={<BrowseProducts />} />
          <Route path="/buyer/orders" element={<MyOrdersView />} />
          <Route path="/buyer/account" element={<AccountView />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrdersView />} />
          <Route path="/account" element={<AccountView />} />
        </Route>

        {/* Other routes with Layout wrapper */}
        <Route element={<Layout />}>
          <Route path="/home" element={<HomeView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/product/:id" element={<ProductDetailsView />} />
        </Route>

        {/* Admin routes */}
        <Route element={<Layout />}>
          <Route element={<AdminRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/products" element={<AdminProducts />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
