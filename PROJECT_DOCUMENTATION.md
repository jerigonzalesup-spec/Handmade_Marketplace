# Craftly / Handmade Marketplace — Project Documentation

## Project Summary
Craftly is a full-stack handmade marketplace demo with a Node.js + Express backend and a React frontend. The backend uses MySQL (via `mysql2` / `sequelize`) for primary storage and has optional MongoDB connectivity. Authentication uses JWT. The client is a Vite + React SPA using Tailwind for styling.

---

## Repository Structure (high-level)
- **backend/**: Express API server, migrations, scripts, models, controllers, routes, utilities.
  - `index.js`, `app.js`: server entry and Express app.
  - `package.json`: backend dependencies and scripts (`start`, `dev`, `migrate`, `seed`).
  - `migrations/`: SQL files (`init.sql`, `reset.sql`) used by the DB helper and migration scripts.
  - `scripts/`: helper scripts (apply migrations, seed demo data, reset DB, create admin/user, repair schema).
  - `src/config/`: DB, JWT, optional Mongo connection helpers.
  - `src/controllers/`: request handlers (auth, cart, craft, order, user).
  - `src/routes/`: route definitions (auth.routes.js, craft.routes.js, cart.routes.js, order.routes.js, user.routes.js).
  - `src/models/`: data access and model helpers (cart.model.js, craft.model.js, order.model.js, user.model.js).
  - `src/middleware/`: auth and error handling middleware.
  - `uploads/`: uploaded images and assets.

- **client/**: React single-page application (Vite)
  - `package.json`: client scripts (`dev`, `build`, `preview`) and deps (React, react-router-dom).
  - `src/`: React components, pages, API wrapper (`src/api/api.js`), context, services, viewModels, and views.
  - `tailwind.config.js`, `postcss.config.js`: Tailwind CSS setup.

- Root files: `README.md`, `DEPLOYMENT_GUIDE.md`, `SRS_DOCUMENT.md`, batch scripts (`dev.bat`, `start-client.bat`, `start-server.bat`).

---

## Tech Stack & Libraries
- Backend: Node.js (ES modules), Express, Sequelize, `mysql2`, `bcryptjs`, `jsonwebtoken`, `dotenv`, `cors`.
- Database: Primary — MySQL (schema/migrations in `backend/migrations/init.sql`). Optional — MongoDB (connects if `MONGODB_URI` provided via `src/config/mongo.js`).
- Client: React 18, React Router, Vite, Tailwind CSS.
- Dev/tools: Vite, PostCSS, Tailwind, npm scripts, small Windows batch helpers included for convenience.

---

## Backend: API Overview
Base URL: `/api`

- Auth (`/api/auth`):
  - `POST /register` — Create user (body: `email, password, name`).
  - `POST /login` — Authenticate, returns JWT.
  - `GET /me` — Get current user (JWT required).
  - `POST /me/become-seller` — Upgrade to seller role (JWT required).

- Crafts (`/api/crafts`):
  - `GET /` — List crafts (query: `page, limit, search`).
  - `GET /:id` — Get craft detail.
  - `POST /` — Create craft (seller only, JWT).
  - `PUT /:id` — Update craft (owner only, JWT).
  - `DELETE /:id` — Delete craft (owner only, JWT).

- Cart (`/api/cart`): many endpoints for getting/setting items, adding/removing/updating quantities. All require JWT.

- Orders (`/api/orders`):
  - `GET /` or `/my` — User orders (JWT).
  - `GET /seller` — Orders for a seller's crafts (seller JWT).
  - `POST /` — Create order from cart (body: `full_name, address, phone`).
  - `PUT /:orderId/status` — Update order status (seller only).

- Users (`/api/users`):
  - `GET /me` — Alias to fetch profile (JWT required).

Controllers live in `backend/src/controllers/` and enforce business rules (stock checks, ownership checks, role checks).

---

## Database & Migrations
- Primary DB: MySQL (connection configured in `backend/src/config/database.js`). Key env vars:
  - `MYSQL_HOST`, `MYSQL_PORT` (default 3306), `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` (default `craftly_db`).
  - `MONGODB_URI` or `MONGO_URI` — optional MongoDB connection.
  - `JWT_SECRET`, `JWT_EXPIRES_IN` — JWT settings (`backend/src/config/jwt.js`).
- Migrations: `backend/migrations/init.sql` is executed automatically by the DB helper on startup (best-effort). Use `backend/scripts/apply_migrations.js` and `backend/scripts/reset_db.js` for controlled migration/reset.
- Seed/demo data: `backend/scripts/seed_demo.js` and helper scripts like `create_admin.js`, `create_jeremy_seller.js`.

---

## Scripts & Utilities (backend)
- `node index.js` — start server (or `npm run start` in `backend/`).
- `npm run dev` (in `backend`) — start server with `node --watch`.
- `npm run migrate` — run `node scripts/apply_migrations.js`.
- `npm run seed` — run `node scripts/seed_demo.js`.
- Repair/reset helpers: `repair_schema.js`, `reset_db.js`, `run_init_sql.js`.

---

## Client (frontend)
- Uses Vite dev server. Main files:
  - `client/src/main.jsx`, `client/src/App.jsx` — app bootstrapping and routing.
  - `client/src/api/api.js` — client-side API wrapper used by services and components.
  - `client/src/components/` — UI building blocks (`Header`, `ProductCard`, `CraftCard`, `Cart`, forms, layouts).
  - `client/src/pages/` — page-level views: `BrowseProducts`, `ProductDetails`, `Cart`, `Checkout`, `SignIn`, `SignUp`, `MyOrdersView`, `OrderSuccess`.
- Run locally: from `client/` run `npm run dev` (uses Vite). Build with `npm run build`.

---

## Environment (common)
- Common env files: add a `.env` in `backend/` with the variables listed above. Example minimal vars:
  - `MYSQL_HOST=127.0.0.1`
  - `MYSQL_PORT=3306`
  - `MYSQL_USER=root`
  - `MYSQL_PASSWORD=secret`
  - `MYSQL_DATABASE=craftly_db`
  - `JWT_SECRET=your_jwt_secret`
  - Optional: `MONGODB_URI=mongodb://...`

---

## Major Third-Party Libraries (selected)
- Backend: `express`, `sequelize`, `mysql2`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`.
- Frontend: `react`, `react-dom`, `react-router-dom`, `vite`, `tailwindcss`.

---

## Notable Files to Inspect
- [backend/package.json](backend/package.json)
- [backend/src/config/database.js](backend/src/config/database.js)
- [backend/src/config/jwt.js](backend/src/config/jwt.js)
- [backend/migrations/init.sql](backend/migrations/init.sql)
- [backend/src/routes/auth.routes.js](backend/src/routes/auth.routes.js)
- [backend/src/routes/craft.routes.js](backend/src/routes/craft.routes.js)
- [client/package.json](client/package.json)
- [client/src/api/api.js](client/src/api/api.js)

---

## How to Run Locally (quick)
1. Start MySQL and create DB (or set `MYSQL_*` env vars to an existing DB).
2. From `backend/`: `npm install` then `npm run migrate` then `npm run seed` (optional) then `npm run dev`.
3. From `client/`: `npm install` then `npm run dev` to run the frontend.

---

If you want, I can:
- Expand this doc with detailed API request/response examples.
- Generate OpenAPI/Swagger spec from routes.
- Add a `README`-style quickstart with example `.env` and SQL export.
