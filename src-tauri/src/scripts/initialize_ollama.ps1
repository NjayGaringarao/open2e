# Add at the top
$Host.UI.RawUI.WindowTitle = "Open2E Setup"
[Console]::Title = "Open2E Setup"

# Step 1: Check if Ollama is installed
$ollamaPath = (Get-Command ollama -ErrorAction SilentlyContinue).Source
if (-not $ollamaPath) {
    Write-Error "Ollama is not installed. Please install Ollama first."
    exit 1
}

# Step 2: Check if Ollama is already running
$ollamaProcess = Get-Process -Name "ollama" -ErrorAction SilentlyContinue
if (-not $ollamaProcess) {
    Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 5
    Write-Host "Ollama started successfully in the background."
} else {
    Write-Host "Ollama is already running."
}

exit 0