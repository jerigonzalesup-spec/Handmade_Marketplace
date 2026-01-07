# 📚 Craftly Documentation Index

## 🎯 START HERE

### Quick Start (5 minutes)
1. **[README.md](README.md)** - 2-step quick start guide
   - `cd backend && npm start` (Terminal 1)
   - `cd client && npm run dev` (Terminal 2)
   - Open http://localhost:5173

### Latest Consolidation (READ THESE)
1. **[CONSOLIDATION_SUMMARY.md](CONSOLIDATION_SUMMARY.md)** ⭐ **[READ THIS FIRST]**
   - Executive summary of consolidation
   - What was accomplished
   - All 8 tasks completed
   - Next steps

2. **[CONSOLIDATION_COMPLETE.md](CONSOLIDATION_COMPLETE.md)** 
   - Completion checklist
   - Test checklist
   - Quick API tests
   - Troubleshooting

3. **[CONSOLIDATION_VERIFICATION.md](CONSOLIDATION_VERIFICATION.md)**
   - Detailed verification report
   - Complete file structure with ✅ marks
   - Configuration details
   - Auth flow diagram
   - Pre-launch checklist

---

## 🚀 Running the Project

### Option 1: Quick (2 Commands)
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd client && npm run dev
```

### Option 2: Using Batch Files (Windows)
```bash
START_GUIDE.bat        # Shows full instructions
start-server.bat       # Starts backend
start-client.bat       # Starts frontend
```

---

## 📂 Project Structure

```
Craftly/
├─ backend/                 ← MAIN BACKEND (Port 4002) ✅
│  ├─ index.js              Entry point
│  ├─ src/app.js            Express app with CORS
│  ├─ src/controllers/      Auth, crafts, orders
│  ├─ src/routes/           /api/* endpoints
│  ├─ src/models/           User, craft, order models
│  ├─ src/middleware/       JWT auth, error handling
│  └─ package.json          Dependencies
│
├─ client/                  ← FRONTEND (Port 5173) ✅
│  ├─ src/api/api.js        API base: http://localhost:4002/api
│  ├─ src/context/          AuthContext global state
│  ├─ src/services/         Auth functions
│  ├─ src/components/       React components
│  ├─ src/pages/            Page components
│  └─ package.json          Dependencies
│
├─ server/                  ⚠️ DEPRECATED (marked for deletion)
│  └─ .DEPRECATED           Marker file
│
└─ [Documentation below]
```

---

## 📖 Documentation Guide

### For Developers
- **[README.md](README.md)** - Quick start & API endpoints
- **[CONSOLIDATION_SUMMARY.md](CONSOLIDATION_SUMMARY.md)** - What changed & why
- **[CONSOLIDATION_VERIFICATION.md](CONSOLIDATION_VERIFICATION.md)** - Technical details & verification

### For Testing
- **[CONSOLIDATION_COMPLETE.md](CONSOLIDATION_COMPLETE.md)** - Test checklist & verification steps
- **[START_GUIDE.bat](START_GUIDE.bat)** - Windows instructions

### Historical/Reference (Older Phase Documentation)
- **[PHASE_21_QUICK_REFERENCE.md](PHASE_21_QUICK_REFERENCE.md)** - Previous phase reference
- **[PHASE_21_COMPLETION.md](PHASE_21_COMPLETION.md)** - Phase 21 summary
- **[AUTHENTICATION_COMPLETE.md](AUTHENTICATION_COMPLETE.md)** - Auth implementation details
- **Other phase files** - Historical development phases

---

## ✅ Consolidation Status

**All 8 Tasks Complete:**

1. ✅ **Consolidation** - Merged `/server` into `/backend`
2. ✅ **Structure** - Proper folder organization
3. ✅ **Behavior** - Port 4002, `/api/*` routes, CORS enabled
4. ✅ **Frontend Fix** - Updated API base URL
5. ✅ **Validation** - All files verified
6. ✅ **Cleanup** - `/server` marked deprecated
7. ✅ **Documentation** - 3 guides + this index
8. ✅ **Finalization** - Ready for testing

---

## 🚀 Quick Commands

| Command | Purpose |
|---------|---------|
| `cd backend && npm start` | Start backend (port 4002) |
| `cd client && npm run dev` | Start frontend (port 5173) |
| `curl http://localhost:4002/api/health` | Test backend health |
| `rm -r server` | Delete old backend folder (safe) |

---

## 🔑 Key Endpoints

| Method | Endpoint | Auth? | Purpose |
|--------|----------|-------|---------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/health` | No | Health check |

---

## 🧪 Test Account

```
Email: demo@craftly.test
Password: password
```

---

## 📝 What to Read Based on Your Need

### "I want to run the project"
→ Read **[README.md](README.md)** (2 min)

### "I want to understand what changed"
→ Read **[CONSOLIDATION_SUMMARY.md](CONSOLIDATION_SUMMARY.md)** (5 min)

### "I need to verify everything works"
→ Read **[CONSOLIDATION_VERIFICATION.md](CONSOLIDATION_VERIFICATION.md)** (10 min)

### "I'm testing and need a checklist"
→ Read **[CONSOLIDATION_COMPLETE.md](CONSOLIDATION_COMPLETE.md)** (5 min)

### "I'm on Windows and need instructions"
→ Run **[START_GUIDE.bat](START_GUIDE.bat)** (1 min)

### "I need technical deep-dive"
→ Read **[CONSOLIDATION_VERIFICATION.md](CONSOLIDATION_VERIFICATION.md)** (Full details)

---

## 🎯 Success Criteria

You'll know it's working when:
- ✅ Backend console shows: "✅ Craftly backend running on http://localhost:4002"
- ✅ Frontend opens at: http://localhost:5173
- ✅ Sign up form submits without "Failed to fetch" error
- ✅ Demo login works: demo@craftly.test / password
- ✅ localStorage has `token` and `user` keys after login
- ✅ Page refresh keeps user logged in
- ✅ Logout clears localStorage and redirects to login

---

## 🔧 Troubleshooting Quick Links

**Backend won't start?**  
→ Check section 1.0 in [CONSOLIDATION_VERIFICATION.md](CONSOLIDATION_VERIFICATION.md#troubleshooting)

**"Failed to fetch" errors?**  
→ Check section 2.0 in [CONSOLIDATION_VERIFICATION.md](CONSOLIDATION_VERIFICATION.md#troubleshooting)

**Port already in use?**  
→ Check section 3.0 in [CONSOLIDATION_VERIFICATION.md](CONSOLIDATION_VERIFICATION.md#troubleshooting)

**Token not persisting?**  
→ Check section 4.0 in [CONSOLIDATION_VERIFICATION.md](CONSOLIDATION_VERIFICATION.md#troubleshooting)

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| Backend Port | 4002 |
| Frontend Port | 5173 |
| API Base | http://localhost:4002/api |
| Frontend Framework | React 18 + Vite |
| Backend Framework | Express.js (ES Modules) |
| Auth Type | JWT Tokens |
| Demo User | demo@craftly.test |

---

## 🎉 Current Status

**Status:** ✅ **READY FOR TESTING**

All code consolidation complete. Backend and frontend are connected and ready to run. No additional changes needed.

**Next Action:** Run `npm start` in both folders and test in browser.

---

## 📚 Document Quick Reference

| File | Size | Purpose |
|------|------|---------|
| [README.md](README.md) | ~2KB | Quick start |
| [CONSOLIDATION_SUMMARY.md](CONSOLIDATION_SUMMARY.md) | ~8KB | Consolidation overview |
| [CONSOLIDATION_COMPLETE.md](CONSOLIDATION_COMPLETE.md) | ~5KB | Completion checklist |
| [CONSOLIDATION_VERIFICATION.md](CONSOLIDATION_VERIFICATION.md) | ~15KB | Detailed verification |
| [START_GUIDE.bat](START_GUIDE.bat) | ~3KB | Windows instructions |

---

## 🔗 Related Documentation

### By Phase
- Phase 9: [PHASE_9_COMPLETE.md](PHASE_9_COMPLETE.md)
- Phase 21: [PHASE_21_COMPLETION.md](PHASE_21_COMPLETION.md)
- Phase 23: [PHASE_23_COMPLETE.md](PHASE_23_COMPLETE.md)

### By Topic
- Authentication: [AUTHENTICATION_COMPLETE.md](AUTHENTICATION_COMPLETE.md)
- System Design: [SYSTEM_DIAGRAM.md](SYSTEM_DIAGRAM.md)
- Ready to Test: [READY_TO_TEST.md](READY_TO_TEST.md)

---

## ✨ Summary

**Backend:** ✅ Consolidated into `/backend` (port 4002)  
**Frontend:** ✅ Updated to use http://localhost:4002/api  
**Auth:** ✅ JWT-based with demo users  
**CORS:** ✅ Enabled for localhost:5173  
**Status:** ✅ Ready for testing  

**👉 Start with:** [README.md](README.md) for quick start  
**📖 Then read:** [CONSOLIDATION_SUMMARY.md](CONSOLIDATION_SUMMARY.md) for details  

**🚀 Ready to launch!**
