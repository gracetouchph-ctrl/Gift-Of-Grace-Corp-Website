"""
Gift of Grace - Desktop Launcher
A simple GUI to start/stop all services
"""

import tkinter as tk
from tkinter import ttk, messagebox
import subprocess
import threading
import webbrowser
import os
import sys
from pathlib import Path

# Get project root directory
PROJECT_ROOT = Path(__file__).parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"

class GiftOfGraceLauncher:
    def __init__(self, root):
        self.root = root
        self.root.title("Gift of Grace - Launcher")
        self.root.geometry("500x750")
        self.root.resizable(False, False)
        self.root.configure(bg="#1a1a2e")

        # Process handles
        self.processes = {
            "frontend": None,
            "admin_api": None,
            "rasa_server": None,
            "rasa_actions": None
        }

        # Status variables
        self.status_vars = {}

        self.create_ui()

    def create_ui(self):
        # Title
        title_frame = tk.Frame(self.root, bg="#1a1a2e")
        title_frame.pack(pady=10)

        tk.Label(
            title_frame,
            text="🎁 Gift of Grace",
            font=("Segoe UI", 24, "bold"),
            fg="#e94560",
            bg="#1a1a2e"
        ).pack()

        tk.Label(
            title_frame,
            text="Application Launcher",
            font=("Segoe UI", 12),
            fg="#888888",
            bg="#1a1a2e"
        ).pack()

        # Mode Selection
        mode_frame = tk.LabelFrame(
            self.root,
            text=" Select Mode ",
            font=("Segoe UI", 10, "bold"),
            fg="#ffffff",
            bg="#16213e",
            padx=15,
            pady=8
        )
        mode_frame.pack(padx=20, pady=5, fill="x")

        self.mode_var = tk.StringVar(value="cloud")

        modes = [
            ("cloud", "☁️  Cloud Mode", "Website + Admin + AI Chatbot (via Internet)"),
            ("demo", "🖥️  Demo Mode", "Website + Admin only (No AI chatbot)"),
            ("rasa", "🤖  RASA Mode", "Website + Admin + Local AI (Slower)")
        ]

        for value, text, desc in modes:
            frame = tk.Frame(mode_frame, bg="#16213e")
            frame.pack(anchor="w", pady=5)

            rb = tk.Radiobutton(
                frame,
                text=text,
                variable=self.mode_var,
                value=value,
                font=("Segoe UI", 11),
                fg="#ffffff",
                bg="#16213e",
                selectcolor="#0f3460",
                activebackground="#16213e",
                activeforeground="#e94560"
            )
            rb.pack(side="left")

            tk.Label(
                frame,
                text=f"  - {desc}",
                font=("Segoe UI", 9),
                fg="#888888",
                bg="#16213e"
            ).pack(side="left")

        # Control Buttons
        btn_frame = tk.Frame(self.root, bg="#1a1a2e")
        btn_frame.pack(pady=10)

        self.start_btn = tk.Button(
            btn_frame,
            text="▶  START",
            command=self.start_services,
            font=("Segoe UI", 14, "bold"),
            fg="#ffffff",
            bg="#4CAF50",
            activebackground="#45a049",
            width=12,
            height=2,
            cursor="hand2",
            relief="flat"
        )
        self.start_btn.pack(side="left", padx=10)

        self.stop_btn = tk.Button(
            btn_frame,
            text="⏹  STOP",
            command=self.stop_services,
            font=("Segoe UI", 14, "bold"),
            fg="#ffffff",
            bg="#f44336",
            activebackground="#da190b",
            width=12,
            height=2,
            cursor="hand2",
            relief="flat",
            state="disabled"
        )
        self.stop_btn.pack(side="left", padx=10)

        # Status Panel
        status_frame = tk.LabelFrame(
            self.root,
            text=" Service Status ",
            font=("Segoe UI", 10, "bold"),
            fg="#ffffff",
            bg="#16213e",
            padx=15,
            pady=8
        )
        status_frame.pack(padx=20, pady=5, fill="x")

        services = [
            ("frontend", "Frontend (React)", "localhost:5173"),
            ("admin_api", "Admin API", "localhost:8001"),
            ("rasa_server", "RASA Server", "localhost:5005"),
            ("rasa_actions", "RASA Actions", "localhost:5055")
        ]

        for key, name, port in services:
            frame = tk.Frame(status_frame, bg="#16213e")
            frame.pack(fill="x", pady=3)

            tk.Label(
                frame,
                text=name,
                font=("Segoe UI", 10),
                fg="#ffffff",
                bg="#16213e",
                width=15,
                anchor="w"
            ).pack(side="left")

            tk.Label(
                frame,
                text=port,
                font=("Segoe UI", 9),
                fg="#888888",
                bg="#16213e",
                width=15,
                anchor="w"
            ).pack(side="left")

            self.status_vars[key] = tk.StringVar(value="⚫ Stopped")
            tk.Label(
                frame,
                textvariable=self.status_vars[key],
                font=("Segoe UI", 10, "bold"),
                fg="#888888",
                bg="#16213e",
                width=12,
                anchor="e"
            ).pack(side="right")

        # Quick Links - Local
        local_frame = tk.LabelFrame(
            self.root,
            text=" Local (localhost) ",
            font=("Segoe UI", 11, "bold"),
            fg="#ffffff",
            bg="#16213e",
            padx=15,
            pady=10
        )
        local_frame.pack(padx=20, pady=5, fill="x")

        local_links = [
            ("🌐  Website", "http://localhost:5173"),
            ("🔐  Admin", "http://localhost:5173/admin/login"),
            ("📚  API Docs", "http://localhost:8001/docs")
        ]

        local_btn_frame = tk.Frame(local_frame, bg="#16213e")
        local_btn_frame.pack()

        for text, url in local_links:
            btn = tk.Button(
                local_btn_frame,
                text=text,
                command=lambda u=url: webbrowser.open(u),
                font=("Segoe UI", 9),
                fg="#ffffff",
                bg="#0f3460",
                activebackground="#1a5276",
                cursor="hand2",
                relief="flat",
                width=12
            )
            btn.pack(side="left", padx=3, pady=3)

        # Quick Links - Deployed (Vercel)
        deployed_frame = tk.LabelFrame(
            self.root,
            text=" Deployed (Vercel) ",
            font=("Segoe UI", 11, "bold"),
            fg="#ffffff",
            bg="#16213e",
            padx=15,
            pady=10
        )
        deployed_frame.pack(padx=20, pady=5, fill="x")

        deployed_links = [
            ("🌐  Website", "https://giftofgrace-website.vercel.app"),
            ("🔐  Admin", "https://giftofgrace-website.vercel.app/admin/login")
        ]

        deployed_btn_frame = tk.Frame(deployed_frame, bg="#16213e")
        deployed_btn_frame.pack()

        for text, url in deployed_links:
            btn = tk.Button(
                deployed_btn_frame,
                text=text,
                command=lambda u=url: webbrowser.open(u),
                font=("Segoe UI", 9),
                fg="#ffffff",
                bg="#4a1a6b",
                activebackground="#6b2d9b",
                cursor="hand2",
                relief="flat",
                width=12
            )
            btn.pack(side="left", padx=3, pady=3)

        # Footer / Config Info
        footer_frame = tk.Frame(self.root, bg="#1a1a2e")
        footer_frame.pack(side="bottom", pady=10)

        tk.Label(
            footer_frame,
            text="Admin Password: admin123",
            font=("Segoe UI", 9),
            fg="#666666",
            bg="#1a1a2e"
        ).pack()

        tk.Label(
            footer_frame,
            text="Deployed: giftofgrace-website.vercel.app",
            font=("Segoe UI", 8),
            fg="#555555",
            bg="#1a1a2e"
        ).pack()

        tk.Label(
            footer_frame,
            text="HF API: lingquerywho-giftofgrace-rag-api.hf.space",
            font=("Segoe UI", 8),
            fg="#555555",
            bg="#1a1a2e"
        ).pack()

    def update_status(self, service, status, color):
        if status == "running":
            self.status_vars[service].set("🟢 Running")
        elif status == "starting":
            self.status_vars[service].set("🟡 Starting...")
        else:
            self.status_vars[service].set("⚫ Stopped")

    def start_services(self):
        mode = self.mode_var.get()
        self.start_btn.configure(state="disabled")
        self.stop_btn.configure(state="normal")

        # Start in a thread to not block UI
        threading.Thread(target=self._start_services_thread, args=(mode,), daemon=True).start()

    def _start_services_thread(self, mode):
        os.chdir(PROJECT_ROOT)

        # Always start Frontend
        self.update_status("frontend", "starting", "yellow")
        self.processes["frontend"] = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=PROJECT_ROOT,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
        )
        self.root.after(3000, lambda: self.update_status("frontend", "running", "green"))

        # Always start Admin API
        self.update_status("admin_api", "starting", "yellow")
        self.processes["admin_api"] = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "admin_api:app", "--host", "0.0.0.0", "--port", "8001"],
            cwd=BACKEND_DIR,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
        )
        self.root.after(3000, lambda: self.update_status("admin_api", "running", "green"))

        # Start RASA if needed
        if mode == "rasa":
            self.update_status("rasa_actions", "starting", "yellow")
            self.processes["rasa_actions"] = subprocess.Popen(
                ["rasa", "run", "actions", "--port", "5055"],
                cwd=BACKEND_DIR,
                creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
            )
            self.root.after(5000, lambda: self.update_status("rasa_actions", "running", "green"))

            self.update_status("rasa_server", "starting", "yellow")
            self.processes["rasa_server"] = subprocess.Popen(
                ["rasa", "run", "--cors", "*", "--enable-api", "--port", "5005"],
                cwd=BACKEND_DIR,
                creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
            )
            self.root.after(10000, lambda: self.update_status("rasa_server", "running", "green"))

        # Open browser after delay
        self.root.after(5000, lambda: webbrowser.open("http://localhost:5173"))

    def stop_services(self):
        self.stop_btn.configure(state="disabled")
        self.start_btn.configure(state="normal")

        for name, process in self.processes.items():
            if process:
                try:
                    process.terminate()
                    process.wait(timeout=5)
                except:
                    try:
                        process.kill()
                    except:
                        pass
            self.update_status(name, "stopped", "gray")
            self.processes[name] = None

        # Also kill any remaining processes
        if sys.platform == "win32":
            os.system("taskkill /f /im node.exe >nul 2>&1")
            # Don't kill all python - just our specific ones

        messagebox.showinfo("Stopped", "All services have been stopped.")

    def on_closing(self):
        if any(p for p in self.processes.values() if p):
            if messagebox.askokcancel("Quit", "Services are still running. Stop them and quit?"):
                self.stop_services()
                self.root.destroy()
        else:
            self.root.destroy()

def main():
    root = tk.Tk()
    app = GiftOfGraceLauncher(root)
    root.protocol("WM_DELETE_WINDOW", app.on_closing)
    root.mainloop()

if __name__ == "__main__":
    main()
