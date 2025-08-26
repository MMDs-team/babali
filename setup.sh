#!/bin/bash
set -e

echo "--- Starting Project Setup ---"

# --- Define Environment Paths ---
PROJECT_DIR=$(pwd)
VENV_DIR="$PROJECT_DIR/env"
PYTHON_EXEC="$VENV_DIR/bin/python"
PIP_EXEC="$VENV_DIR/bin/pip"
PLAYWRIGHT_EXEC="$VENV_DIR/bin/playwright"
MANAGE_PY_PATH="$PROJECT_DIR/backend/manage.py"

# --- Pre-flight Check ---
if [ ! -d "$VENV_DIR" ]; then
    echo "ERROR: Virtual environment not found at $VENV_DIR"
    echo "Please create it first using: python -m venv env"
    exit 1
fi

# 1. Install Python Dependencies
echo "Installing Python dependencies..."
"$PIP_EXEC" install -r requirements.txt

# 2. Install Playwright Dependencies and Browser
echo "Checking for Playwright browser..."
if [ -z "$PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH" ]; then
    echo "PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH not set. Installing browser and dependencies..."
    if command -v pacman &> /dev/null; then
        sudo pacman -Syu --needed --noconfirm nss alsa-lib gtk3 xdg-utils libxss cronie
        "$PLAYWRIGHT_EXEC" install chromium
    elif command -v dnf &> /dev/null; then
        sudo dnf install -y nss alsa-lib gtk3 xdg-utils libXScrnSaver cronie
        "$PLAYWRIGHT_EXEC" install chromium
    elif command -v yum &> /dev/null; then
        sudo yum install -y nss alsa-lib gtk3 xdg-utils libXScrnSaver cronie
        "$PLAYWRIGHT_EXEC" install chromium
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y cron
        "$PLAYWRIGHT_EXEC" install --with-deps chromium
    else
        echo "Could not determine package manager. Attempting to install browser only."
        "$PLAYWRIGHT_EXEC" install chromium
    fi
else
    echo "Using existing browser from PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH. Skipping installation."
fi


# 3. Set up Cron Job for PDF Cleanup
echo "Setting up every 5 minute cron job for ticket cleanup..."
if command -v systemctl &> /dev/null; then
    sudo systemctl enable --now cronie.service || sudo systemctl enable --now cron.service
fi
CRON_COMMAND="*/5 * * * * $PYTHON_EXEC $MANAGE_PY_PATH cleanup_ticket_pdfs >> /tmp/cron_ticket_pdfs_cleanup.log 2>&1"
COMMENT="# Django Ticket Cleanup Job"

if ! crontab -l | grep -Fq "$MANAGE_PY_PATH cleanup_ticket_pdfs"; then
    (crontab -l 2>/dev/null; echo "$COMMENT"; echo "$CRON_COMMAND") | crontab -
    echo "Cron job added successfully."
else
    echo "Cron job already exists. No changes made."
fi

echo "--- Project Setup Complete! ---"
