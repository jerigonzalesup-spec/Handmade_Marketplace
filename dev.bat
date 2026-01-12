@echo off
REM Dev helper: starts backend and client dev servers (Windows)
REM Requires node and npm. Run from repository root.
cd backend && start cmd /k "npm run dev" && cd ..
cd client && start cmd /k "npm run dev"