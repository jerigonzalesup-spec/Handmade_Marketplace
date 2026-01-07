import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import craftRoutes from './routes/craft.routes.js';
import orderRoutes from './routes/order.routes.js';
import cartRoutes from './routes/cart.routes.js';
import errorMiddleware from './middleware/error.middleware.js';

export default function createApp() {
  const app = express();

  // Basic middleware
  app.use(cors({
    origin: function(origin, callback) {
      // Allow localhost on any port during development
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true
  }));
  app.use(express.json());

  // Health
  app.get('/api/health', (req, res) => res.json({ ok: true }));

  // Mount API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/crafts', craftRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);

  // 404
  app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

  // Error handler
  app.use(errorMiddleware);

  return app;
}
