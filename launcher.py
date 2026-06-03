#!/usr/bin/env python3
"""
Awana Tracker Launcher
Provides a GUI to start the web server and open the application in a browser
"""

import tkinter as tk
from tkinter import messagebox
import subprocess
import webbrowser
import os
import sys
import signal
import time
import socket
from pathlib import Path

class AwanaTrackerLauncher:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Awana Tracker Launcher")
        self.root.geometry("500x400")
        self.root.resizable(False, False)
        
        # Server process
        self.server_process = None
        self.port = 8000
        
        # Get the directory where this script is located
        self.app_dir = Path(__file__).parent.absolute()
        
        # Setup UI
        self.setup_ui()
        
        # Handle window close
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
        
    def setup_ui(self):
        # Header
        header_frame = tk.Frame(self.root, bg="#667eea", height=80)
        header_frame.pack(fill=tk.X)
        header_frame.pack_propagate(False)
        
        title_label = tk.Label(
            header_frame,
            text="🎯 Awana Tracker Launcher",
            font=("Arial", 20, "bold"),
            bg="#667eea",
            fg="white"
        )
        title_label.pack(pady=20)
        
        # Main content
        content_frame = tk.Frame(self.root, padx=20, pady=20)
        content_frame.pack(fill=tk.BOTH, expand=True)
        
        # Status label
        self.status_label = tk.Label(
            content_frame,
            text="Server Status: Stopped",
            font=("Arial", 12),
            fg="red"
        )
        self.status_label.pack(pady=10)
        
        # Port info
        port_label = tk.Label(
            content_frame,
            text=f"Port: {self.port}",
            font=("Arial", 10),
            fg="gray"
        )
        port_label.pack(pady=5)
        
        # URL label
        self.url_label = tk.Label(
            content_frame,
            text="",
            font=("Arial", 10),
            fg="blue",
            cursor="hand2"
        )
        self.url_label.pack(pady=5)
        
        # Buttons frame
        buttons_frame = tk.Frame(content_frame)
        buttons_frame.pack(pady=20)
        
        # Start button
        self.start_button = tk.Button(
            buttons_frame,
            text="🚀 Start Server & Open App",
            font=("Arial", 12, "bold"),
            bg="#667eea",
            fg="white",
            padx=20,
            pady=10,
            command=self.start_server,
            cursor="hand2"
        )
        self.start_button.pack(pady=5)
        
        # Stop button
        self.stop_button = tk.Button(
            buttons_frame,
            text="⏹️ Stop Server",
            font=("Arial", 12),
            bg="#e74c3c",
            fg="white",
            padx=20,
            pady=10,
            command=self.stop_server,
            state=tk.DISABLED,
            cursor="hand2"
        )
        self.stop_button.pack(pady=5)
        
        # Open browser button
        self.open_button = tk.Button(
            buttons_frame,
            text="🌐 Open in Browser",
            font=("Arial", 12),
            bg="#3498db",
            fg="white",
            padx=20,
            pady=10,
            command=self.open_browser,
            state=tk.DISABLED,
            cursor="hand2"
        )
        self.open_button.pack(pady=5)
        
        # Info text
        info_text = tk.Label(
            content_frame,
            text="This launcher starts a local web server\nso Google Drive sync features work properly.",
            font=("Arial", 9),
            fg="gray",
            justify=tk.CENTER
        )
        info_text.pack(pady=20)
        
        # Footer
        footer_label = tk.Label(
            content_frame,
            text="Keep this window open while using the app",
            font=("Arial", 8, "italic"),
            fg="gray"
        )
        footer_label.pack(side=tk.BOTTOM, pady=10)
        
    def is_port_in_use(self, port):
        """Check if a port is already in use"""
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            return s.connect_ex(('localhost', port)) == 0
    
    def start_server(self):
        """Start the HTTP server"""
        try:
            # Check if port is already in use
            if self.is_port_in_use(self.port):
                response = messagebox.askyesno(
                    "Port In Use",
                    f"Port {self.port} is already in use.\nThis might mean the server is already running.\n\nDo you want to open the app in your browser anyway?"
                )
                if response:
                    self.open_browser()
                return
            
            # Start the server
            self.status_label.config(text="Starting server...", fg="orange")
            self.root.update()
            
            # Change to app directory
            os.chdir(self.app_dir)
            
            # Start Python HTTP server
            if sys.platform == "win32":
                # Windows: use CREATE_NO_WINDOW flag
                startupinfo = subprocess.STARTUPINFO()
                startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
                self.server_process = subprocess.Popen(
                    [sys.executable, "-m", "http.server", str(self.port)],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    startupinfo=startupinfo
                )
            else:
                # Unix-like systems
                self.server_process = subprocess.Popen(
                    [sys.executable, "-m", "http.server", str(self.port)],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    preexec_fn=os.setpgrp
                )
            
            # Wait a moment for server to start
            time.sleep(1)
            
            # Check if server started successfully
            if self.server_process.poll() is None:
                url = f"http://localhost:{self.port}"
                self.status_label.config(text="Server Status: Running ✓", fg="green")
                self.url_label.config(text=url)
                self.url_label.bind("<Button-1>", lambda e: self.open_browser())
                
                # Update button states
                self.start_button.config(state=tk.DISABLED)
                self.stop_button.config(state=tk.NORMAL)
                self.open_button.config(state=tk.NORMAL)
                
                # Open browser automatically
                self.open_browser()
                
                messagebox.showinfo(
                    "Server Started",
                    f"Server is running at:\n{url}\n\nThe app has been opened in your browser.\n\nKeep this launcher window open while using the app."
                )
            else:
                raise Exception("Server failed to start")
                
        except Exception as e:
            messagebox.showerror(
                "Error",
                f"Failed to start server:\n{str(e)}\n\nMake sure Python is installed and accessible."
            )
            self.status_label.config(text="Server Status: Error", fg="red")
            self.server_process = None
    
    def stop_server(self):
        """Stop the HTTP server"""
        if self.server_process:
            try:
                if sys.platform == "win32":
                    # Windows
                    self.server_process.terminate()
                else:
                    # Unix-like systems
                    os.killpg(os.getpgid(self.server_process.pid), signal.SIGTERM)
                
                self.server_process.wait(timeout=5)
                self.server_process = None
                
                self.status_label.config(text="Server Status: Stopped", fg="red")
                self.url_label.config(text="")
                
                # Update button states
                self.start_button.config(state=tk.NORMAL)
                self.stop_button.config(state=tk.DISABLED)
                self.open_button.config(state=tk.DISABLED)
                
                messagebox.showinfo("Server Stopped", "The server has been stopped.")
                
            except Exception as e:
                messagebox.showerror("Error", f"Failed to stop server:\n{str(e)}")
    
    def open_browser(self):
        """Open the app in the default browser"""
        url = f"http://localhost:{self.port}"
        try:
            webbrowser.open(url)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to open browser:\n{str(e)}")
    
    def on_closing(self):
        """Handle window close event"""
        if self.server_process:
            response = messagebox.askyesno(
                "Confirm Exit",
                "The server is still running.\nDo you want to stop it and exit?"
            )
            if response:
                self.stop_server()
                self.root.destroy()
        else:
            self.root.destroy()
    
    def run(self):
        """Start the GUI"""
        self.root.mainloop()

def main():
    app = AwanaTrackerLauncher()
    app.run()

if __name__ == "__main__":
    main()

# Made with Bob
