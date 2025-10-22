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

# Run the installer from %TEMP% with hidden window
Start-Process -FilePath "$env:TEMP\OllamaSetup.exe" -ArgumentList "/VERYSILENT", "/SUPPRESSMSGBOXES", "/NOCANCEL" -WindowStyle Hidden -Wait

Write-Output "Waiting for installer to finish..."
Start-Sleep -Seconds 5

Start-Sleep -Seconds 3

# Automatically close Welcome Window
$processesToKill = @("ollama", "ollama app")
foreach ($name in $processesToKill) {
    Get-Process -Name $name -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Output "Closing process: $($_.Name)"
        Stop-Process -Id $_.Id -Force
    }
}

Write-Output "Installation and cleanup complete."
