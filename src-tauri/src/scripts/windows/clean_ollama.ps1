# Add at the top
$Host.UI.RawUI.WindowTitle = "Open2E Setup"
[Console]::Title = "Open2E Setup"

Write-Output "Starting uninstallation..."

# 1. Kill running Ollama processes
$processesToKill = @("ollama", "ollama app")
foreach ($name in $processesToKill) {
    Get-Process -Name $name -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Output "Stopping process: $($_.Name)"
        Stop-Process -Id $_.Id -Force
    }
}

Start-Sleep -Seconds 2

# 2. Run the uninstaller silently from the actual path
$uninstaller = "$env:LOCALAPPDATA\Programs\Ollama\unins000.exe"
if (Test-Path $uninstaller) {
    Write-Output "Running uninstaller..."
    Start-Process $uninstaller -ArgumentList "/VERYSILENT", "/SUPPRESSMSGBOXES", "/NORESTART", "/NOCANCEL" -Wait
}
else {
    Write-Output "Uninstaller not found at: $uninstaller"
}

# 3. Remove leftover config/model data
$leftovers = @(
    "$env:USERPROFILE\.ollama",
    "$env:APPDATA\Ollama",
    "$env:LOCALAPPDATA\Programs\Ollama"  # Optional: Remove installer folder if still present
)

foreach ($path in $leftovers) {
    if (Test-Path $path) {
        try {
            Write-Output "Removing: $path"
            Remove-Item -Recurse -Force -Path $path
        }
        catch {
            Write-Warning "Failed to remove ${path}: $($_.Exception.Message)"
        }
    }
}


Write-Output "Ollama uninstallation and cleanup complete."
