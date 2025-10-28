# --- Open2E Setup: phi4-mini Installation ---
$Host.UI.RawUI.WindowTitle = "Open2E Setup"
[Console]::Title = "Open2E Setup"

Write-Output "Checking if phi4-mini is already installed..."

# Check if Ollama and phi4-mini are installed
try {
    $ollamaList = ollama list 2>&1
    $isPhi4Installed = $ollamaList | Select-String -Pattern "phi4-mini"

    if ($isPhi4Installed) {
        Write-Output "phi4-mini is already installed."
        exit 0
    }
}
catch {
    Write-Output "Error checking Ollama installation: $_"
}

Write-Output "Extracting phi4-mini model..."

# Get zip path from argument
$zipPath = $args[0]
if (-not $zipPath) {
    Write-Error "Zip file path not provided."
    exit 1
}

if (-not (Test-Path $zipPath)) {
    Write-Error "Zip file not found: $zipPath"
    exit 1
}

# Create TEMP working folder
$tempDir = Join-Path $env:TEMP "phi4_mini_prepack"
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Extract to TEMP
try {
    Write-Output "Extracting to temporary directory: $tempDir"
    Expand-Archive -Path $zipPath -DestinationPath $tempDir -Force
    Write-Output "Extraction complete."
}
catch {
    Write-Error "Failed to extract zip: $_"
    exit 1
}

# Prepare destination (.ollama/models)
$ollamaDir = Join-Path $env:USERPROFILE ".ollama"
$modelsDir = Join-Path $ollamaDir "models"

if (-not (Test-Path $ollamaDir)) {
    New-Item -ItemType Directory -Path $ollamaDir -Force | Out-Null
}
if (-not (Test-Path $modelsDir)) {
    New-Item -ItemType Directory -Path $modelsDir -Force | Out-Null
}

# Copy extracted models
Write-Output "Copying model files to $modelsDir ..."
Copy-Item -Path (Join-Path $tempDir "models\*") -Destination $modelsDir -Recurse -Force
Write-Output "Models copied successfully."

# Clean up temporary directory
Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
Write-Output "Temporary files removed."

Write-Output "phi4-mini installation complete."
exit 0