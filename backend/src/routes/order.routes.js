import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getUserOrders, createOrder, getSellerOrders, updateOrderStatus } from '../controllers/order.controller.js';

const router = express.Router();

/**
 * GET /api/orders
 * Get all orders for current user
 * Protected: Requires JWT token
 * Returns: [{ id, user_id, total, status, created_at, items }]
 */
router.get('/', authMiddleware, getUserOrders);

/**
 * GET /api/orders/my
 * Alias endpoint to fetch current user's orders
 * Protected: Requires JWT token
 * Returns: Same as GET /api/orders
 */
router.get('/my', authMiddleware, getUserOrders);

/**
 * GET /api/orders/seller
 * Get all orders for crafts sold by current user (seller view)
 * Protected: Requires JWT token, user must be seller
 * Returns: [{ id, user_id, total, status, created_at, items }]
 */
router.get('/seller', authMiddleware, getSellerOrders);

/**
 * POST /api/orders
 * Create a new order from user's shopping cart
 * Protected: Requires JWT token
 * Body: { full_name, address, phone }
 * Returns: { id, user_id, total, status, created_at }
 */
router.post('/', authMiddleware, createOrder);

/**
 * PUT /api/orders/:orderId/status
 * Update order status (seller only)
 * Protected: Requires JWT token, must be seller of items in order
 * Params: orderId (order ID to update)
 * Body: { status } (e.g., "pending", "processing", "shipped", "delivered")
 * Returns: { message, order }
 */
router.put('/:orderId/status', authMiddleware, updateOrderStatus);

export default router;
