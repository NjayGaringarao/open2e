# Add at the top
$Host.UI.RawUI.WindowTitle = "Open2E Setup"
[Console]::Title = "Open2E Setup"

Write-Output "Checking if phi4-mini is already installed..."

# Check if Ollama is installed and if phi4-mini exists
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

# Get the zip file path from arguments
$zipPath = $args[0]
if (-not $zipPath) {
    Write-Error "Zip file path not provided"
    exit 1
}

if (-not (Test-Path $zipPath)) {
    Write-Error "Zip file not found: $zipPath"
    exit 1
}

# Create .ollama directory if it doesn't exist
$ollamaDir = Join-Path $env:USERPROFILE ".ollama"
if (-not (Test-Path $ollamaDir)) {
    New-Item -ItemType Directory -Path $ollamaDir -Force | Out-Null
}

# Extract the zip file
try {
    Write-Output "Extracting to: $ollamaDir"
    Expand-Archive -Path $zipPath -DestinationPath $ollamaDir -Force
    Write-Output "Extraction complete."
}
catch {
    Write-Error "Failed to extract zip: $_"
    exit 1
}

Write-Output "phi4-mini installation complete."

# copy phi4_mini_prepack/models to .ollama/models
Copy-Item -Path "phi4_mini_prepack/models" -Destination "$ollamaDir/models" -Force
Write-Output "Models copied to .ollama/models."

# delete phi4_mini_prepack
Remove-Item -Path "phi4_mini_prepack" -Recurse -Force

exit 0
