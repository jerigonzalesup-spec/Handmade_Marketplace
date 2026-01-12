# Backend (Node.js)

Overview
- REST API implemented under `backend/src/` with controllers in `backend/src/controllers/`.
- Database: MySQL (pool configured in `backend/src/config/database.js`). Migrations are in `backend/migrations/`.

Where to add features
- Add API routes in `backend/src/routes/` and controllers in `backend/src/controllers/`.
- Add DB helpers in `backend/src/models/` and update `backend/migrations/init.sql` as needed.

Run
From repo root:

```bash
cd backend
npm install
npm run start
```

DB notes
- `backend/src/config/database.js` attempts to apply migrations on startup (best-effort).
- If schema issues occur, run `node backend/scripts/repair_schema.js` or `node backend/scripts/reset_db.js`.
