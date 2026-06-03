#!/bin/bash
# Awana Tracker GUI Launcher for macOS/Linux
# Double-click this file or run: ./Launch_Awana_Tracker_GUI.sh

echo "Starting Awana Tracker Launcher..."

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if Python is available
if command -v python3 &> /dev/null; then
    python3 launcher.py
elif command -v python &> /dev/null; then
    python launcher.py
else
    echo ""
    echo "Error: Python is not installed or not in PATH"
    echo "Please install Python from https://www.python.org/"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

# Made with Bob
