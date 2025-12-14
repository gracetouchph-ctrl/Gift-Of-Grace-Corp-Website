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
╚═══════════════════════════════════════╝
```

### Requirements

- Python 3.8+ (tkinter included)
- No additional packages needed

### Modes Explained

| Mode | Description |
|------|-------------|
| **Cloud** | Uses Hugging Face API (Gemini/OpenAI/OpenRouter) - Best for demos |
| **Demo** | Website + Admin only - Fastest startup, no AI chatbot |
| **RASA** | Full local AI - Requires RASA installed, slower startup |
