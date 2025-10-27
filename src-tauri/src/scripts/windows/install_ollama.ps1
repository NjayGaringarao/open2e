# Add at the top
$Host.UI.RawUI.WindowTitle = "Open2E Setup"
[Console]::Title = "Open2E Setup"

# Check if Ollama is already installed
$ollamaPath = Get-Command "ollama" -ErrorAction SilentlyContinue

if ($ollamaPath) {
    Write-Output "Ollama already installed"
    exit 0
}

# Run the installer from %TEMP% with hidden window
Write-Output "Starting Ollama installation..."
Start-Process -FilePath "$env:TEMP\OllamaSetup.exe" -ArgumentList "/VERYSILENT", "/SUPPRESSMSGBOXES", "/NOCANCEL" -WindowStyle Hidden -Wait

Write-Output "Installation complete, cleaning up..."

# Wait a bit for any auto-launched processes
Start-Sleep -Seconds 10

# Kill all Ollama-related processes more aggressively
$processPatterns = @("ollama", "ollama app", "ollama.exe", "ollama app.exe")
foreach ($pattern in $processPatterns) {
    Get-Process -Name $pattern -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Output "Stopping process: $($_.ProcessName) (PID: $($_.Id))"
        try {
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        }
        catch {
            Write-Output "Could not stop process $($_.ProcessName)"
        }
    }
}

# Also try wildcard search for any remaining processes
$processPatterns = @("ollama*", "Ollama*")
foreach ($pattern in $processPatterns) {
    Get-Process -Name $pattern -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Output "Stopping process: $($_.ProcessName) (PID: $($_.Id))"
        try {
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        }
        catch {
            Write-Output "Could not stop process $($_.ProcessName)"
        }
    }
}

# Wait a bit for any auto-launched processes
Start-Sleep -Seconds 2

# Also try to close any Ollama windows by title
$windowTitle = "Ollama*"
$windows = Get-Process | Where-Object { $_.MainWindowTitle -like $windowTitle }
foreach ($window in $windows) {
    Write-Output "Closing window: $($window.MainWindowTitle)"
    try {
        Stop-Process -Id $window.Id -Force -ErrorAction SilentlyContinue
    }
    catch {
        Write-Output "Could not close window"
    }
}

# Final wait to ensure processes are terminated
Start-Sleep -Seconds 2

Write-Output "Installation and cleanup complete"
exit 0
