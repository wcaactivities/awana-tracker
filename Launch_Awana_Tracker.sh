#!/bin/bash
# Awana Sparks Tracker Launcher for Mac/Linux
# Double-click this file to launch the application

echo "Starting Awana Sparks Tracker..."

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Open index.html in the default browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$DIR/index.html"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "$DIR/index.html"
else
    echo "Unsupported operating system"
    exit 1
fi

# Made with Bob
