# Exit immediately if a command fails
$ErrorActionPreference = "Stop"

Write-Host "--- Starting Project Setup ---"

# --- Define Environment Paths ---
$ProjectDir = $PSScriptRoot
$VenvDir = Join-Path $ProjectDir "env"
$PythonExec = Join-Path $VenvDir "Scripts\python.exe"
$PlaywrightExec = Join-Path $VenvDir "Scripts\playwright.exe"
$ManagePyPath = Join-Path $ProjectDir "backend\manage.py"

# --- Pre-flight Check ---
if (-not (Test-Path $VenvDir)) {
    Write-Error "ERROR: Virtual environment not found at $VenvDir"
    Write-Error "Please create it first using: python -m venv env"
    exit 1
}

# 1. Install Python Dependencies
Write-Host "Installing Python dependencies..."
& $PythonExec -m pip install -r requirements.txt

# 2. Install Playwright Browser
Write-Host "Checking for Playwright browser..."
if (-not ($env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH)) {
    Write-Host "PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH not set. Installing browser..."
    & $PlaywrightExec install chromium
}
else {
    Write-Host "Using existing browser from PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH. Skipping installation."
}

# 3. Set up Scheduled Task for PDF Cleanup
Write-Host "Setting up a 5-minute scheduled task for ticket cleanup..."
$TaskName = "Django Ticket Cleanup"
$LogFile = Join-Path $env:TEMP "cron_ticket_cleanup.log"

# First, remove any old versions of the task to ensure a clean start
schtasks /delete /tn $TaskName /f | Out-Null
Write-Host "Removed any existing task with the same name."

# Define the full command the task will run
# IMPORTANT: We build the full command string for schtasks.exe
$CommandToRun = "cmd.exe /c `"$($PythonExec)`" `"$($ManagePyPath)`" cleanup_tickets >> `"$($LogFile)`" 2>&1"

# Create the task using the reliable schtasks.exe tool
Write-Host "Creating new scheduled task using schtasks.exe..."
schtasks /create /tn $TaskName /tr $CommandToRun /sc minute /mo 5 /ru "SYSTEM" /rl HIGHEST

# Verify the task was created
$task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($null -ne $task) {
    Write-Host "Scheduled task '$TaskName' created successfully."
    Write-Host "It will run every 5 minutes."
} else {
    Write-Host "ERROR: Failed to create the scheduled task."
}

Write-Host "--- Project Setup Complete! ---"
