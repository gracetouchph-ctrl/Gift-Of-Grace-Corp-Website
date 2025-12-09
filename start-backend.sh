#!/bin/bash
echo "============================================"
echo "Gift of Grace - Backend Server Startup"
echo "============================================"
echo ""

cd "$(dirname "$0")/backend"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "[INFO] Virtual environment not found. Creating one..."
    python3 -m venv venv
    source venv/bin/activate
    echo "[INFO] Installing dependencies..."
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

echo ""
echo "[1/2] Starting RASA Action Server on port 5055..."
rasa run actions --port 5055 &
ACTIONS_PID=$!

echo ""
echo "[2/2] Starting RASA Server on port 5005..."
sleep 5
rasa run --cors "*" --enable-api --port 5005 &
RASA_PID=$!

echo ""
echo "============================================"
echo "Backend servers started!"
echo ""
echo "RASA Server:    http://localhost:5005"
echo "Actions Server: http://localhost:5055"
echo "REST Webhook:   http://localhost:5005/webhooks/rest/webhook"
echo ""
echo "Process IDs:"
echo "  Actions: $ACTIONS_PID"
echo "  RASA:    $RASA_PID"
echo ""
echo "Press Ctrl+C to stop"
echo "============================================"

wait
