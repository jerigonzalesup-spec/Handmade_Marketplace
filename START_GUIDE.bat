@echo off
REM ============================================
REM Craftly - Backend Consolidation Complete
REM Run this file OR follow the steps below
REM ============================================

echo.
echo ========================================
echo 🎉 Craftly Backend Consolidation
echo ========================================
echo.
echo ✅ All backend logic consolidated into /backend (port 4002)
echo ✅ Frontend connected to http://localhost:4002/api
echo ✅ Ready for testing
echo.
echo ========================================
echo QUICK START GUIDE
echo ========================================
echo.
echo 1. Open Terminal 1 and run:
echo    cd backend
echo    npm install
echo    npm start
echo.
echo 2. Open Terminal 2 and run:
echo    cd client
echo    npm install
echo    npm run dev
echo.
echo 3. Open browser to: http://localhost:5173
echo    Demo account: demo@craftly.test / password
echo.
echo ========================================
echo WHAT CHANGED
echo ========================================
echo.
echo ✅ Backend: ONLY at /backend (port 4002)
echo ✅ API Routes: ALL under /api/* prefix
echo ✅ Frontend: Uses http://localhost:4002/api
echo ✅ Deprecated: /server marked with .DEPRECATED file
echo.
echo ========================================
echo VERIFY IT WORKS
echo ========================================
echo.
echo After starting backend + frontend:
echo.
echo 1. Check backend console shows:
echo    ✅ Craftly backend running on http://localhost:4002
echo.
echo 2. Check frontend loads at:
echo    http://localhost:5173
echo.
echo 3. Test sign up:
echo    - Fill registration form
echo    - Should POST to http://localhost:4002/api/auth/register
echo    - Should show success (no "Failed to fetch" errors)
echo.
echo 4. Test login:
echo    - Email: demo@craftly.test
echo    - Password: password
echo    - Should POST to http://localhost:4002/api/auth/login
echo    - Should show token in localStorage
echo.
echo ========================================
echo FILES MODIFIED
echo ========================================
echo.
echo ✅ /backend/index.js
echo ✅ /backend/src/app.js
echo ✅ /backend/src/controllers/auth.controller.js
echo ✅ /backend/src/middleware/auth.middleware.js
echo ✅ /client/src/api/api.js
echo ✅ /server/.DEPRECATED (new marker)
echo ✅ README.md (updated)
echo.
echo ========================================
echo TROUBLESHOOTING
echo ========================================
echo.
echo Q: "Failed to fetch" errors?
echo A: Check backend running on 4002, verify API base in client/src/api/api.js
echo.
echo Q: Port 4002 already in use?
echo A: Backend auto-increments to 4003, 4004, etc. (shown in console)
echo.
echo Q: How to delete /server folder?
echo A: Safe to delete - everything is in /backend now
echo    rd /s /q server  (or use File Explorer)
echo.
echo ========================================
echo Ready? Start the servers!
echo ========================================
echo.
pause
