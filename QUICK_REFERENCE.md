# 🚀 QUICK REFERENCE CARD

## ONE-PAGE CHEAT SHEET

### Start Here
```bash
# Terminal 1
cd backend && npm start

# Terminal 2 (new terminal)
cd client && npm run dev

# Open browser
http://localhost:5173
```

### Quick Test
```bash
# Backend health
curl http://localhost:4002/api/health

# Sign up
curl -X POST http://localhost:4002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass123","name":"Test"}'

# Login
curl -X POST http://localhost:4002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@craftly.test","password":"password"}'
```

---

## KEY FILES

| Path | Purpose |
|------|---------|
| `backend/index.js` | Start here (port 4002) |
| `backend/src/app.js` | Express app + CORS + routes |
| `client/src/api/api.js` | API base URL |
| `client/src/context/AuthContext` | Global auth state |

---

## API ENDPOINTS

```
GET    /api/health                    No auth
POST   /api/auth/register             No auth
POST   /api/auth/login                No auth
GET    /api/auth/me                   ✅ Bearer token
GET    /api/crafts                    Optional token
GET    /api/orders                    Optional token
```

---

## PORTS

- **Backend:** 4002 (auto-fallback to 4003, 4004...)
- **Frontend:** 5173

---

## DEMO USER

- Email: `demo@craftly.test`
- Password: `password`

---

## TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Port in use | Backend auto-increments, check console |
| "Failed to fetch" | Check backend running on 4002 |
| Token not saving | Check localStorage in DevTools |
| 404 errors | Verify API base in `client/src/api/api.js` |

---

## FOLDERS

```
✅ /backend/            ONE backend (port 4002)
✅ /client/             ONE frontend (port 5173)
⚠️  /server/            DEPRECATED (can delete)
⚠️  /frontend/          OLD (can delete)
```

---

## DOCS

| Doc | Read for |
|-----|----------|
| README.md | Quick start |
| CONSOLIDATION_SUMMARY.md | What changed |
| CONSOLIDATION_VERIFICATION.md | Technical details |
| VISUAL_GUIDE.md | Before/after comparison |
| FINAL_REPORT.md | Completion status |

---

## SUCCESS = ✅

- Backend says: "✅ Craftly backend running on http://localhost:4002"
- Frontend loads at: http://localhost:5173
- Sign up works without errors
- Demo login works
- Token in localStorage

---

## STATUS

🎉 **CONSOLIDATION COMPLETE - READY TO TEST**

All code done. Run servers and test!

---

**Last Updated:** 2024  
**Version:** 1.0  
**Status:** Ready ✅
