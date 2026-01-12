# 🚀 Craftly - Deployment & Multi-Device Setup Guide

This guide explains how to run Craftly on different computers, laptops, and even access it from your phone.

---

## 📋 What You Need (Tools to Download)

### Essential Requirements (All Platforms)

1. **Node.js 16+** (includes npm)
   - Download: [nodejs.org](https://nodejs.org)
   - Check installation: `node --version` and `npm --version`

2. **Git** (for version control)
   - Download: [git-scm.com](https://git-scm.com)
   - Optional but recommended

3. **Code Editor** (optional, for editing code)
   - VS Code: [code.visualstudio.com](https://code.visualstudio.com)
   - Or any text editor

### Installation Steps by Operating System

---

## 🪟 Windows (Desktop/Laptop)

### Step 1: Download Node.js
1. Go to [nodejs.org](https://nodejs.org)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the prompts
4. Accept defaults (includes npm automatically)
5. Restart your computer after installation

### Step 2: Verify Installation
Open PowerShell or Command Prompt and run:
```bash
node --version
npm --version
```
You should see version numbers (e.g., `v18.17.0`).

### Step 3: Download Craftly Project
Option A - Using Git:
```bash
git clone https://github.com/YOUR_USERNAME/craftly.git
cd craftly
```

Option B - Without Git:
- Download as ZIP from GitHub
- Extract to a folder (e.g., `C:\Users\YourName\craftly`)
- Open PowerShell in that folder

### Step 4: Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install client dependencies (in a NEW terminal)
cd client
npm install
```

### Step 5: Run the Website
**Terminal 1 - Backend:**
```bash
cd backend
npm run start
# You should see: "Backend running on http://localhost:4002"
```

**Terminal 2 - Frontend (new terminal):**
```bash
cd client
npm run dev
# You should see: "Local: http://localhost:5173"
```

### Step 6: Open in Browser
Visit: `http://localhost:5173`

---

## 🍎 macOS (Mac Computer/Laptop)

### Step 1: Download Node.js
1. Go to [nodejs.org](https://nodejs.org)
2. Download the macOS LTS version (choose your chip: Intel or Apple Silicon)
3. Run the `.pkg` installer
4. Follow the prompts

### Step 2: Verify Installation
Open Terminal and run:
```bash
node --version
npm --version
```

### Step 3: Download Craftly
```bash
# Using Git:
git clone https://github.com/YOUR_USERNAME/craftly.git
cd craftly

# Or manually download and extract ZIP
```

### Step 4: Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd client
npm install
```

### Step 5: Run the Website
**Terminal 1:**
```bash
cd backend
npm run start
```

**Terminal 2:**
```bash
cd client
npm run dev
```

### Step 6: Open in Browser
Visit: `http://localhost:5173`

**Tip:** On macOS, you can use `Command+T` to open a new terminal tab instead of new window.

---

## 🐧 Linux (Ubuntu/Debian/Other)

### Step 1: Install Node.js
Using apt (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify:
```bash
node --version
npm --version
```

### Step 2: Download Craftly
```bash
git clone https://github.com/YOUR_USERNAME/craftly.git
cd craftly
```

### Step 3: Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd client
npm install
```

### Step 4: Run the Website
```bash
# Terminal 1 - Backend
cd backend
npm run start

# Terminal 2 - Frontend
cd client
npm run dev
```

### Step 5: Open in Browser
Visit: `http://localhost:5173`

---

## 📱 Access from Phone/Tablet (Same Network)

Once the website is running on your computer, you can view it from your phone on the **same WiFi network**.

### Step 1: Find Your Computer's IP Address

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" (usually 192.168.x.x)
```

**Mac/Linux:**
```bash
ifconfig
# Look for "inet" address (usually 192.168.x.x)
```

### Step 2: Access from Phone
1. Make sure phone and computer are on **same WiFi**
2. On your phone, open browser and visit:
   ```
   http://YOUR_COMPUTER_IP:5173
   ```
   Example: `http://192.168.1.100:5173`

3. You should see Craftly website!

**Troubleshooting:**
- If it doesn't work, check firewall (Windows Defender may block)
- Make sure backend is running on port 4002
- Phone must be on same WiFi network

---

## ☁️ Deploy Online (Free Options)

### Option 1: Heroku (Free tier available)

**Backend:**
1. Sign up at [heroku.com](https://heroku.com)
2. Install Heroku CLI
3. Run:
```bash
cd backend
heroku login
heroku create your-app-name
git push heroku main
```

**Frontend (Netlify or Vercel):**
1. Sign up at [netlify.com](https://netlify.com) or [vercel.com](https://vercel.com)
2. Connect your GitHub repo
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy!

### Option 2: Railway.app (Modern, free)
1. Sign up at [railway.app](https://railway.app)
2. Connect GitHub repo
3. Add environment variables
4. Deploy with one click

### Option 3: Replit (Quick & Easy)
1. Sign up at [replit.com](https://replit.com)
2. Create new project from GitHub
3. Run with play button
4. Get public URL to share

---

## 🔧 Troubleshooting

### "npm: command not found"
- Node.js not installed or not in PATH
- Restart computer after installing Node.js
- Verify: `node --version`

### "Port 5173 already in use"
- Another app using the port
- Kill the process: `npm run dev` on different port
- Or restart computer

### "Backend running but frontend shows 404"
- Make sure backend is running on port 4002
- Frontend should be on port 5173
- Check API_BASE_URL in `client/src/services/api.js`

### "Cannot connect from phone"
- Check both devices on same WiFi
- Disable VPN
- Check Windows Firewall (allow Node.js)
- Use correct IP address (not localhost)

### "npm install takes forever"
- Normal on first install (downloads many packages)
- Can take 5-10 minutes depending on internet
- Be patient, it's one-time

---

## 📦 Environment Variables (.env)

Create `backend/.env` file:
```env
PORT=4002
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=craftly_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

Create `client/.env.local` file:
```env
VITE_API_URL=http://localhost:4002/api
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Backend running (terminal shows "Backend running on http://localhost:4002")
- [ ] Frontend running (terminal shows "Local: http://localhost:5173")
- [ ] Can open http://localhost:5173 in browser
- [ ] Can login with test account
- [ ] Can view products
- [ ] Can access from phone on same WiFi

---

## 🎓 Quick Reference Commands

```bash
# Install dependencies (first time only)
npm install

# Run backend
cd backend && npm run start

# Run frontend
cd client && npm run dev

# Run both at once (Windows)
dev.bat

# Stop running app
Ctrl+C in terminal

# Check if ports are in use
# Windows: netstat -ano | findstr :5173
# Mac/Linux: lsof -i :5173
```

---

## 📞 Need Help?

- Check logs in terminal for error messages
- Verify all prerequisites are installed
- Try restarting the terminal and application
- Check GitHub Issues for known problems

---

**Last Updated:** January 12, 2026  
**Craftly Version:** 2.0
