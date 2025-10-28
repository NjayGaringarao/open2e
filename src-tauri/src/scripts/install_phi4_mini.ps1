# --- Open2E Setup: phi4-mini Installation ---
$Host.UI.RawUI.WindowTitle = "Open2E Setup"
[Console]::Title = "Open2E Setup"
$ErrorActionPreference = "Stop"

function Write-Log {
    param([string]$Message)
    if (-not $global:LogPath) {
        $global:LogPath = Join-Path $env:TEMP "open2e_phi4_mini_install.log"
    }
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss.fff")
    try { Add-Content -Path $global:LogPath -Value "[$ts] $Message" -ErrorAction SilentlyContinue } catch {}
    Write-Output $Message
}

Write-Log "Starting phi4-mini installation..."

Write-Log "Preparing to install phi4-mini..."

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

try {
    $zipInfo = Get-Item -LiteralPath $zipPath -ErrorAction Stop
    Write-Log ("Zip path: {0} ({1:N0} bytes)" -f $zipInfo.FullName, $zipInfo.Length)
}
catch { Write-Log "Failed to stat zip: $_" }

# Create TEMP working folder
$tempDir = Join-Path $env:TEMP "phi4_mini_prepack"
if (Test-Path $tempDir) {
    Write-Log "Cleaning existing temp dir: $tempDir"
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Extract to TEMP
try {
    Write-Log "Extracting to temporary directory: $tempDir"
    Expand-Archive -Path $zipPath -DestinationPath $tempDir -Force
    Write-Log "Extraction complete."
    try {
        $top = Get-ChildItem -Path $tempDir -Force -ErrorAction SilentlyContinue | Select-Object -First 10 | ForEach-Object { $_.FullName }
        foreach ($t in $top) { Write-Log ("Extract top: {0}" -f $t) }
    }
    catch {}
}
catch {
    Write-Error "Failed to extract zip: $_"
    exit 1
}

# Locate 'models' dir in extracted content
$modelsSourceDir = $null
try {
    $candidates = Get-ChildItem -Path $tempDir -Recurse -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -ieq "models" }

    foreach ($cand in $candidates) {
        $hasBlobs = Test-Path (Join-Path $cand.FullName "blobs")
        $hasManifests = Test-Path (Join-Path $cand.FullName "manifests")
        if ($hasBlobs -and $hasManifests) { $modelsSourceDir = $cand.FullName; break }
    }

    if (-not $modelsSourceDir) {
        $fallback = Join-Path $tempDir "models"
        if (Test-Path $fallback) { $modelsSourceDir = $fallback }
    }

    if (-not $modelsSourceDir) {
        Write-Error "Could not locate 'models' folder in extracted zip."
        exit 1
    }
    Write-Log "Found models source: $modelsSourceDir"
}
catch {
    Write-Error "Failed to resolve models source directory: $_"
    exit 1
}

# Prepare destination (.ollama\models)
$ollamaDir = Join-Path $env:USERPROFILE ".ollama"
$modelsDir = Join-Path $ollamaDir "models"

if (-not (Test-Path $ollamaDir)) {
    New-Item -ItemType Directory -Path $ollamaDir -Force | Out-Null
}
if (-not (Test-Path $modelsDir)) {
    New-Item -ItemType Directory -Path $modelsDir -Force | Out-Null
}

# Best effort: stop Ollama service/processes to avoid file locks
try {
    $svc = Get-Service -Name "ollama" -ErrorAction SilentlyContinue
    if ($svc -and $svc.Status -eq "Running") {
        Write-Log "Stopping Ollama service..."
        Stop-Service -Name "ollama" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }
}
catch {}

# Also kill any running ollama processes
try {
    $procs = Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "*ollama*" }
    foreach ($p in $procs) {
        Write-Log "Killing process: $($p.Name) (PID $($p.Id))"
        try { Stop-Process -Id $p.Id -Force -ErrorAction Stop } catch { & taskkill /F /PID $p.Id 2>$null }
    }
}
catch {}

Write-Log "Copying model files to $modelsDir ..."
try {
    Copy-Item -Path (Join-Path $modelsSourceDir '*') -Destination $modelsDir -Recurse -Force -ErrorAction Stop
}
catch {
    Write-Error "Copy failed: $_"
    exit 1
}

# Optional: quick validation
try {
    $manifestDir = Join-Path $modelsDir "manifests\registry.ollama.ai\library\phi4-mini\latest"
    if (-not (Test-Path $manifestDir)) {
        Write-Log "Warning: phi4-mini manifest not found at expected path: $manifestDir"
    }
    else {
        Write-Log "Manifest present: $manifestDir"
    }
}
catch {}

# Clean up temporary directory
try {
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Log "Temporary files removed."
}
catch {}

Write-Log "phi4-mini installation complete."
exit 0