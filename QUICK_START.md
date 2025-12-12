# Quick Start Guide

## Start Everything (Recommended)

### Windows
```bash
start-all-admin.bat
```

This will start:
- ✅ RASA Backend Server (port 5005)
- ✅ RASA Actions Server (port 5055)  
- ✅ Admin API Server (port 8001)
- ✅ Frontend Dev Server (port 5173)

### Linux/Mac
```bash
chmod +x start-all-admin.sh
./start-all-admin.sh
```

## Individual Services

### Start Only Frontend + Backend (No Admin)
**Windows:**
```bash
start-all.bat
```

**Linux/Mac:**
```bash
./start-backend.sh
npm run dev
```

### Start Only Admin API
**Windows:**
```bash
start-admin-api.bat
```

**Linux/Mac:**
```bash
chmod +x start-admin-api.sh
./start-admin-api.sh
```

## Access Points

After starting all services:

- **Main Website**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login
  - Default password: `admin123`
- **Admin API**: http://localhost:8001
- **RASA Server**: http://localhost:5005

## First Time Setup

1. **Install Dependencies:**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend
   pip install -r requirements.txt
   pip install -r admin_requirements.txt
   ```

2. **Set Up Environment Variables:**
   - Create `backend/.env` with your API keys
   - See `.env.example` for reference

3. **Run Startup Script:**
   ```bash
   start-all-admin.bat  # Windows
   # or
   ./start-all-admin.sh  # Linux/Mac
   ```

## Troubleshooting

### Port Already in Use
If a port is already in use, you can:
- Stop the process using that port
- Or modify the port in the startup scripts

### Admin API Won't Start
- Make sure you've installed admin requirements: `pip install -r backend/admin_requirements.txt`
- Check that port 8001 is available

### Frontend Can't Connect to Admin API
- Verify Admin API is running on port 8001
- Check `VITE_ADMIN_API_URL` in your environment variables

## Stopping Services

### Windows
- Close each command window, or press `Ctrl+C` in each

### Linux/Mac
- Press `Ctrl+C` in the terminal running the script
- Or kill processes: `pkill -f "uvicorn\|rasa\|vite"`

