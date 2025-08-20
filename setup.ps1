# Exit immediately if a command fails
$ErrorActionPreference = "Stop"

Write-Host "--- Starting Project Setup ---"

# --- Define Environment Paths ---
$ProjectDir = $PSScriptRoot
$VenvDir = Join-Path $ProjectDir "env"
$PythonExec = Join-Path $VenvDir "Scripts\python.exe"
$PipExec = Join-Path $VenvDir "Scripts\pip.exe"
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
& $PipExec install -r requirements.txt

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
Write-Host "Setting up hourly scheduled task for ticket cleanup..."
$TaskName = "Django Ticket Cleanup"
$LogFile = Join-Path $env:TEMP "cron_ticket_cleanup.log"
$task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($null -eq $task) {
    Write-Host "Creating new scheduled task..."
    $Action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$PythonExec`" `"$ManagePyPath`" cleanup_tickets >> `"$LogFile`" 2>&1"
    $Trigger = New-ScheduledTaskTrigger -Hourly -RepetitionInterval (New-TimeSpan -Minutes 5)
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Description "Deletes old ticket PDFs for the Django project."
    Write-Host "Scheduled task '$TaskName' created successfully."
} else {
    Write-Host "Scheduled task '$TaskName' already exists. No changes made."
}

Write-Host "--- Project Setup Complete! ---"
