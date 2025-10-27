# Add at the top
$Host.UI.RawUI.WindowTitle = "Open2E Setup"
[Console]::Title = "Open2E Setup"

# Check if Ollama is already installed
$ollamaPath = Get-Command "ollama" -ErrorAction SilentlyContinue

if ($ollamaPath) {
    Start-Sleep -Seconds 2
    Write-Output "100"
    exit 0
}

# Run the bundled installer with hidden window
$installerPath = $args[0]
if (-not $installerPath) {
    Write-Error "Installer path not provided"
    exit 1
}

Start-Process -FilePath $installerPath -ArgumentList "/VERYSILENT", "/SUPPRESSMSGBOXES", "/NOCANCEL" -WindowStyle Hidden -Wait

Write-Output "Waiting for installer to finish..."
Start-Sleep -Seconds 5

# Give Ollama time to launch its UI
Start-Sleep -Seconds 5

# Automatically close Welcome Window - Try multiple times with retries
$maxRetries = 10
$retryCount = 0

function Stop-OllamaProcesses {
    param([int]$retryNum = 0)
    
    Write-Output "Attempt $retryNum - Killing Ollama processes..."
    
    # Try different process name patterns
    $processesToKill = @("ollama", "ollama app", "Ollama", "OllamaApp")
    foreach ($name in $processesToKill) {
        Get-Process -Name $name -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Output "Closing process: $($_.Name) (PID: $($_.Id))"
            try {
                Stop-Process -Id $_.Id -Force -ErrorAction Stop
                Start-Sleep -Milliseconds 500
            }
            catch {
                Write-Output "Failed to stop via Stop-Process, trying taskkill..."
                & taskkill /F /PID $_.Id 2>$null
            }
        }
    }
    
    # Kill any remaining Ollama-related processes by filtering on process path
    $ollamaProcesses = Get-Process -ErrorAction SilentlyContinue | Where-Object {
        $_.Path -and ($_.Path -like "*ollama*" -or $_.Name -like "*ollama*")
    }
    foreach ($proc in $ollamaProcesses) {
        Write-Output "Closing process by path: $($proc.Name) (PID: $($proc.Id))"
        try {
            Stop-Process -Id $proc.Id -Force -ErrorAction Stop
            Start-Sleep -Milliseconds 500
        }
        catch {
            Write-Output "Failed to stop via Stop-Process, trying taskkill..."
            & taskkill /F /PID $proc.Id 2>$null
        }
    }
    
    # Try using taskkill by name as well
    & taskkill /F /IM "ollama.exe" 2>$null
    & taskkill /F /IM "Ollama.exe" 2>$null
    
    # Check if Ollama service is running and stop it
    try {
        $service = Get-Service -Name "ollama" -ErrorAction SilentlyContinue
        if ($service -and $service.Status -eq 'Running') {
            Write-Output "Stopping Ollama service..."
            Stop-Service -Name "ollama" -Force -ErrorAction SilentlyContinue
        }
    }
    catch {
        # Service doesn't exist or can't be accessed
    }
}

while ($retryCount -lt $maxRetries) {
    Stop-OllamaProcesses -retryNum $retryCount
    
    # Wait a bit and check if processes are gone
    Start-Sleep -Seconds 2
    
    # Check if any Ollama processes still exist
    $remainingProcesses = Get-Process -ErrorAction SilentlyContinue | Where-Object {
        ($_.Path -and $_.Path -like "*ollama*") -or $_.Name -like "*ollama*"
    }
    
    if ($remainingProcesses.Count -eq 0) {
        Write-Output "All Ollama processes terminated successfully."
        break
    }
    
    $retryCount++
    Write-Output "Retry $retryCount of $maxRetries - Found $($remainingProcesses.Count) remaining processes..."
}

Write-Output "Installation and cleanup complete."