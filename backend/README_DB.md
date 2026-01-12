# Database Setup and Maintenance for Craftly Backend

## Prerequisites
- MySQL server running and accessible (XAMPP, Docker, or standalone MySQL)
- Node dependencies installed (`npm install` in the `backend` folder)

## Environment Configuration

Create a `.env` file in the `backend` folder with the following variables:

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=craftly_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=4002
```

**Reference**: See `.env.example` for template.

## Schema Overview

The backend uses **InnoDB** tables with UTF8MB4 charset:

- **users**: User accounts with authentication (id, email, password_hash, name, role, created_at)
- **crafts**: Products/crafts listed for sale (id, title, description, price, stock_quantity, image, seller_id FK, created_at)
- **carts**: Shopping carts linked to users (id, user_id UNIQUE)
- **cart_items**: Items within carts (id, cart_id FK, craft_id FK, quantity)
- **orders**: Customer orders (id, user_id FK, total, full_name, address, phone, status, created_at)
- **order_items**: Items within orders (id, order_id FK, craft_id FK, quantity, price)

## Automatic Migrations

Migrations are **automatically applied** when the backend starts:
1. On startup, `backend/src/config/database.js` executes all SQL in `backend/migrations/init.sql`
2. Uses `CREATE TABLE IF NOT EXISTS` so it's **idempotent** and safe to run multiple times
3. After execution, the backend performs schema verification and logs results

**No manual migration step is required.** Just start the backend:

```bash
cd backend
npm install
npm start  # or npm run dev for watch mode
```

Expected startup logs:
```
[DB] Migrations applied
[DB] Schema verified
server listening at { address: '127.0.0.1', family: 'IPv4', port: 4002 }
```

## Database Recovery and Repair

### Non-Destructive Repair (Recommended)

If you encounter schema errors ("Table doesn't exist", missing columns), run the repair script:

```bash
node backend/scripts/repair_schema.js
```

This script:
- Creates missing tables with `CREATE TABLE IF NOT EXISTS`
- Adds missing columns with `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
- Does **NOT drop or delete any data**
- Safe to run multiple times (idempotent)

Example output:
```
[REPAIR] Connecting to MySQL...
[REPAIR] Creating table users
[REPAIR] Creating table crafts
...
[REPAIR] Schema repair complete. Verifying...
[REPAIR] users.password_hash present
[REPAIR] Done.
```

### Full Database Reset (Destructive)

If you need to completely reset the database and reseed demo data:

```bash
node backend/scripts/reset_db.js
```

**Warning**: This will drop the entire `craftly_db` database and recreate it with seed data. Use only in development.

## Seed Data

To populate the database with demo data (users, crafts, orders):

```bash
node backend/scripts/seed_demo.js
```

Demo users created:
- `user@example.com` (password: `password`)
- `seller@example.com` (password: `password`)

## Manual Database Initialization

If automatic migrations fail or you want to set up manually:

```bash
mysql -u root -p
CREATE DATABASE IF NOT EXISTS craftly_db;
USE craftly_db;
SOURCE /path/to/backend/migrations/init.sql;
```

## Dependencies

The following Node packages handle database operations:
- **mysql2/promise**: MySQL client with connection pooling
- **bcryptjs**: Password hashing for user authentication
- Other packages: `express`, `cors`, `dotenv`, `jsonwebtoken`

## Architecture Notes

- Backend uses a **connection pool** (`backend/src/config/database.js`) for efficient database access
- All routes preserve data consistency with proper error handling
- Orders are created inside **transactions** to validate and deduct stock atomically
- API routes: `/api/auth`, `/api/cart`, `/api/crafts`, `/api/orders`, `/api/users`

## Troubleshooting

### "Table 'craftly_db.users' doesn't exist"
- Run: `node backend/scripts/repair_schema.js`
- Or restart backend to trigger automatic migrations

### "Port 3306 already in use"
- MySQL server is running elsewhere, or port conflict
- Change `MYSQL_PORT` in `.env` if needed
- Check with: `netstat -an | find ":3306"`

### "Access denied for user 'root'"
- Verify `MYSQL_USER` and `MYSQL_PASSWORD` in `.env`
- Ensure MySQL service is running

### Backend starts but API requests fail with 500 errors
- Check backend logs for "[DB] Schema verified"
- If not present, schema verification may still be async
- Run repair script: `node backend/scripts/repair_schema.js`

## Production Deployment

Before deploying:
1. Create `.env` with production values (strong JWT_SECRET, secure DB password)
2. Run schema repair: `node backend/scripts/repair_schema.js`
3. Test auth flow: register → login → view profile
4. Test cart/order flows end-to-end
5. Verify all API endpoints respond correctly

For more details on API endpoints, see route files in `backend/src/routes/`.
