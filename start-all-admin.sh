#!/bin/bash

echo "============================================"
echo "Gift of Grace - Complete Startup (with Admin)"
echo "============================================"
echo ""
echo "This will start:"
echo "  1. RASA Backend Server (port 5005)"
echo "  2. RASA Actions Server (port 5055)"
echo "  3. Admin API Server (port 8001)"
echo "  4. Frontend Dev Server (port 5173)"
echo ""
echo "PREREQUISITES:"
echo "  1. Python 3.10 installed"
echo "  2. Node.js installed"
echo "  3. All dependencies installed"
echo ""
read -p "Press Enter to continue..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js not found. Please install Node.js first."
    exit 1
fi

# Check Python
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "[ERROR] Python not found. Please install Python first."
    exit 1
fi

# Install npm dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing npm dependencies..."
    npm install
fi

# Start RASA backend servers
echo ""
echo "[1/4] Starting RASA Backend Servers..."
./start-backend.sh &
RASA_PID=$!

# Wait for RASA to initialize
echo ""
echo "Waiting for RASA servers to initialize..."
sleep 10

# Start Admin API
echo ""
echo "[2/4] Starting Admin API Server..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "[ERROR] Virtual environment not found. Please run start-backend.sh first."
    exit 1
fi

source venv/bin/activate

# Check if admin requirements are installed
python -c "import fastapi" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "[INFO] Installing admin API dependencies..."
    pip install -r admin_requirements.txt
fi

# Start Admin API in background
python -m uvicorn admin_api:app --host 0.0.0.0 --port 8001 --reload &
ADMIN_PID=$!

cd ..

# Wait for Admin API to initialize
echo ""
echo "Waiting for Admin API to initialize..."
sleep 5

# Start frontend
echo ""
echo "[3/4] Starting Frontend Server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "============================================"
echo "[4/4] All servers starting!"
echo ""
echo "RASA Server:    http://localhost:5005"
echo "Actions Server: http://localhost:5055"
echo "Admin API:      http://localhost:8001"
echo "Frontend:       http://localhost:5173"
echo "Admin Panel:    http://localhost:5173/admin/login"
echo ""
echo "Default Admin Password: admin123"
echo ""
echo "Wait about 30-60 seconds for everything to load."
echo "Press Ctrl+C to stop all servers."
echo "============================================"
echo ""

# Wait for user interrupt
trap "kill $RASA_PID $ADMIN_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait

