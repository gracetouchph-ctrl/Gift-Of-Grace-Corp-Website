# Dev Tools - Gift of Grace

## GUI Launcher

A simple desktop GUI to manage all services.

### How to Run

**Option 1: Double-click**
```
Double-click LAUNCHER.bat
```

**Option 2: Command line**
```bash
cd dev
python launcher.py
```

### Features

- **Mode Selection**: Choose between Cloud, Demo, or RASA mode
- **Start/Stop**: One-click to start or stop all services
- **Status Monitor**: See which services are running
- **Quick Links**: Open website, admin panel, or API docs
- **Live Log Terminal**: Real-time console output from all services

### Screenshot

```
╔═══════════════════════════════════════╗
║     🎁 Gift of Grace                  ║
║     Application Launcher              ║
╠═══════════════════════════════════════╣
║  ○ ☁️  Cloud Mode (Recommended)       ║
║  ○ 🖥️  Demo Mode                      ║
║  ○ 🤖  RASA Mode                      ║
╠═══════════════════════════════════════╣
║  [ ▶ START ]    [ ⏹ STOP ]           ║
╠═══════════════════════════════════════╣
║  Frontend      localhost:5173  🟢     ║
║  Admin API     localhost:8001  🟢     ║
║  RASA Server   localhost:5005  ⚫     ║
║  RASA Actions  localhost:5055  ⚫     ║
╠═══════════════════════════════════════╣
║  🌐 Open Website                      ║
║  🔐 Open Admin Panel                  ║
║  📚 API Documentation                 ║
╠═══════════════════════════════════════╣
║  Logs                                 ║
║  ┌─────────────────────────────────┐  ║
║  │ [12:30:01] Starting Frontend... │  ║
║  │ [12:30:02] Starting Admin API...│  ║
║  │ [12:30:04] Frontend started     │  ║
║  │ [12:30:05] All services ready!  │  ║
║  └─────────────────────────────────┘  ║
║        [ Clear Logs ]                 ║
╚═══════════════════════════════════════╝
```

### Log Terminal

The launcher includes a built-in log terminal that displays:
- **System messages** (blue): Startup/shutdown status
- **Info messages** (green): Service output and status updates
- **Warnings** (yellow): Important notices (e.g., RASA loading)
- **Errors** (red): Any error messages from services

The log terminal captures real-time output from all running services, making it easy to debug issues without opening separate terminal windows.

### Requirements

- Python 3.8+ (tkinter included)
- No additional packages needed

### Modes Explained

| Mode | Description |
|------|-------------|
| **Cloud** | Uses Hugging Face API (Gemini/OpenAI/OpenRouter) - Best for demos |
| **Demo** | Website + Admin only - Fastest startup, no AI chatbot |
| **RASA** | Full local AI - Requires RASA installed, slower startup |
