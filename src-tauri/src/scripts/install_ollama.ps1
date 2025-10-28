# Add at the top
# Ensure quiet console title if run standalone or by installer
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
$installerPath = if ($args.Count -ge 1 -and $args[0]) {
    $args[0]
} else {
    Join-Path $env:ProgramData "Open2E\Resources\ollama\OllamaSetup.exe"
}
if (-not (Test-Path $installerPath)) {
    Write-Error "Installer not found: $installerPath"
    exit 1
}

Start-Process -FilePath $installerPath -ArgumentList "/VERYSILENT", "/SUPPRESSMSGBOXES", "/NORESTART" -WindowStyle Hidden

Write-Output "Waiting for Ollama installer to complete (including respawns)..."

$goneCount = 0
$requiredGone = 10

while ($true) {
    # Get all candidate processes
    $proc = Get-Process -ErrorAction SilentlyContinue | Where-Object {
        $_.ProcessName -match '^(OllamaSetup|OllamaSetup\.tmp|Setup|Setup\.tmp|OllamaInstaller)$'
    }

    if ($proc) {
        $goneCount = 0
        foreach ($p in $proc) {
            Write-Output "Ollama installer still running (PID $($p.Id), Name $($p.ProcessName))..."
        }
    }
    else {
        $goneCount++
        Write-Output "Installer not detected ($goneCount/$requiredGone)..."
        if ($goneCount -ge $requiredGone) {
            Write-Output "Ollama installer has fully finished."
            break
        }
    }

    Start-Sleep -Seconds 1
}

Write-Output "Closing Ollama app window..."
$ollamaProcesses = Get-Process -ErrorAction SilentlyContinue | Where-Object {
    $_.MainWindowTitle -like "Ollama" -or $_.ProcessName -like "ollama*"
}

foreach ($proc in $ollamaProcesses) {
    try {
        $proc.CloseMainWindow() | Out-Null
        Start-Sleep -Milliseconds 500
        if (!$proc.HasExited) {
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
            Write-Output "Force-closed Ollama process $($proc.ProcessName) (PID $($proc.Id))"
        }
    }
    catch {
        Write-Output "Error closing process $($proc.ProcessName): $_"
    }
}

Write-Output "Ollama setup and cleanup complete."
exit 0
