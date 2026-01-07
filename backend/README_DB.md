Database setup for Craftly backend

Prereqs:
- MySQL server running and accessible
- Node dependencies installed (`npm install`) in the `backend` folder

Environment variables (create a `.env` in `backend`):

MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=craftly_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

Migrations:
- Run the SQL in `backend/migrations/init.sql` against your MySQL server to create the required tables.

Example (using mysql CLI):

```
mysql -u root -p
CREATE DATABASE IF NOT EXISTS craftly_db;
USE craftly_db;
SOURCE migrations/init.sql;
```

Dependencies added:
- `mysql2` (already listed in `backend/package.json`) for DB access
- `bcryptjs` for password hashing (already listed)

Start backend:

```
cd backend
npm install
npm run dev
```

Notes:
- The backend uses a connection pool (`backend/src/config/database.js`).
- The API routes `/api/cart`, `/api/orders`, `/api/crafts`, `/api/auth` are kept intact but now persist to MySQL.
- Orders are created inside a transaction to validate and deduct stock atomically.

If you want, I can add a small migration runner or a seed script to create a demo admin user.
