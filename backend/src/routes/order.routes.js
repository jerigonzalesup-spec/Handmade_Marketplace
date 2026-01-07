import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getUserOrders, createOrder } from '../controllers/order.controller.js';

const router = express.Router();

// GET /api/orders/  (protected)
router.get('/', authMiddleware, getUserOrders);

// POST /api/orders/  (protected) - create order from cart
router.post('/', authMiddleware, createOrder);

export default router;
