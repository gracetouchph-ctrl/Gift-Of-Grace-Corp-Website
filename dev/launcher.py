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
        self.root.geometry("550x900")
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

        # Log text widget reference
        self.log_text = None

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

        # Log Terminal
        log_frame = tk.LabelFrame(
            self.root,
            text=" Logs ",
            font=("Segoe UI", 10, "bold"),
            fg="#ffffff",
            bg="#16213e",
            padx=10,
            pady=5
        )
        log_frame.pack(padx=20, pady=5, fill="both", expand=True)

        # Log text widget with scrollbar
        log_container = tk.Frame(log_frame, bg="#0d1117")
        log_container.pack(fill="both", expand=True)

        scrollbar = tk.Scrollbar(log_container)
        scrollbar.pack(side="right", fill="y")

        self.log_text = tk.Text(
            log_container,
            height=10,
            font=("Consolas", 9),
            fg="#00ff00",
            bg="#0d1117",
            insertbackground="#00ff00",
            wrap="word",
            yscrollcommand=scrollbar.set,
            state="disabled"
        )
        self.log_text.pack(side="left", fill="both", expand=True)
        scrollbar.config(command=self.log_text.yview)

        # Configure log tags for different message types
        self.log_text.tag_configure("info", foreground="#00ff00")
        self.log_text.tag_configure("warning", foreground="#ffff00")
        self.log_text.tag_configure("error", foreground="#ff4444")
        self.log_text.tag_configure("system", foreground="#00bfff")

        # Clear log button
        clear_btn = tk.Button(
            log_frame,
            text="Clear Logs",
            command=self.clear_logs,
            font=("Segoe UI", 8),
            fg="#ffffff",
            bg="#333333",
            activebackground="#555555",
            cursor="hand2",
            relief="flat"
        )
        clear_btn.pack(pady=3)

        self.log("Launcher ready. Select a mode and click START.", "system")

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

    def log(self, message, tag="info"):
        """Add a message to the log terminal."""
        if self.log_text is None:
            return
        self.log_text.configure(state="normal")
        timestamp = threading.current_thread().name != "MainThread" and "" or ""
        from datetime import datetime
        timestamp = datetime.now().strftime("[%H:%M:%S] ")
        self.log_text.insert("end", timestamp + message + "\n", tag)
        self.log_text.see("end")
        self.log_text.configure(state="disabled")

    def clear_logs(self):
        """Clear all log messages."""
        self.log_text.configure(state="normal")
        self.log_text.delete("1.0", "end")
        self.log_text.configure(state="disabled")
        self.log("Logs cleared.", "system")

    def start_services(self):
        mode = self.mode_var.get()
        self.start_btn.configure(state="disabled")
        self.stop_btn.configure(state="normal")

        mode_names = {"cloud": "Cloud", "demo": "Demo", "rasa": "RASA"}
        self.log(f"Starting services in {mode_names.get(mode, mode)} mode...", "system")

        # Start in a thread to not block UI
        threading.Thread(target=self._start_services_thread, args=(mode,), daemon=True).start()

    def _start_services_thread(self, mode):
        os.chdir(PROJECT_ROOT)

        # Always start Frontend
        self.root.after(0, lambda: self.log("Starting Frontend (npm run dev)...", "info"))
        self.update_status("frontend", "starting", "yellow")
        self.processes["frontend"] = subprocess.Popen(
            "npm run dev",
            cwd=PROJECT_ROOT,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
        )
        # Start thread to read frontend output
        threading.Thread(target=self._read_process_output, args=(self.processes["frontend"], "Frontend"), daemon=True).start()
        self.root.after(3000, lambda: self.update_status("frontend", "running", "green"))
        self.root.after(3000, lambda: self.log("Frontend started at http://localhost:5173", "info"))

        # Always start Admin API
        self.root.after(500, lambda: self.log("Starting Admin API (uvicorn)...", "info"))
        self.update_status("admin_api", "starting", "yellow")
        self.processes["admin_api"] = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "admin_api:app", "--host", "0.0.0.0", "--port", "8001"],
            cwd=BACKEND_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
        )
        # Start thread to read admin api output
        threading.Thread(target=self._read_process_output, args=(self.processes["admin_api"], "AdminAPI"), daemon=True).start()
        self.root.after(3000, lambda: self.update_status("admin_api", "running", "green"))
        self.root.after(3000, lambda: self.log("Admin API started at http://localhost:8001", "info"))

        # Start RASA if needed
        if mode == "rasa":
            self.root.after(1000, lambda: self.log("Starting RASA Actions server...", "info"))
            self.update_status("rasa_actions", "starting", "yellow")
            self.processes["rasa_actions"] = subprocess.Popen(
                ["rasa", "run", "actions", "--port", "5055"],
                cwd=BACKEND_DIR,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
            )
            threading.Thread(target=self._read_process_output, args=(self.processes["rasa_actions"], "RASAActions"), daemon=True).start()
            self.root.after(5000, lambda: self.update_status("rasa_actions", "running", "green"))
            self.root.after(5000, lambda: self.log("RASA Actions started at http://localhost:5055", "info"))

            self.root.after(1500, lambda: self.log("Starting RASA Server (this may take a while)...", "warning"))
            self.update_status("rasa_server", "starting", "yellow")
            self.processes["rasa_server"] = subprocess.Popen(
                ["rasa", "run", "--cors", "*", "--enable-api", "--port", "5005"],
                cwd=BACKEND_DIR,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
            )
            threading.Thread(target=self._read_process_output, args=(self.processes["rasa_server"], "RASAServer"), daemon=True).start()
            self.root.after(10000, lambda: self.update_status("rasa_server", "running", "green"))
            self.root.after(10000, lambda: self.log("RASA Server started at http://localhost:5005", "info"))

        # Open browser after delay
        self.root.after(5000, lambda: self.log("Opening browser...", "system"))
        self.root.after(5000, lambda: webbrowser.open("http://localhost:5173"))
        self.root.after(5500, lambda: self.log("All services started successfully!", "system"))

    def _read_process_output(self, process, name):
        """Read process stdout/stderr and log it."""
        try:
            for line in iter(process.stdout.readline, b''):
                if line:
                    decoded = line.decode('utf-8', errors='replace').strip()
                    if decoded:
                        # Truncate long lines
                        if len(decoded) > 100:
                            decoded = decoded[:100] + "..."
                        self.root.after(0, lambda msg=f"[{name}] {decoded}": self.log(msg, "info"))
        except:
            pass

    def stop_services(self):
        self.stop_btn.configure(state="disabled")
        self.start_btn.configure(state="normal")

        self.log("Stopping all services...", "warning")

        for name, process in self.processes.items():
            if process:
                self.log(f"Stopping {name}...", "info")
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

        self.log("All services stopped.", "system")
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
