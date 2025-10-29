export const CLEAN_OLLAMA = `
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
$uninstaller = "$env:LOCALAPPDATA\\Programs\\Ollama\\unins000.exe"
if (Test-Path $uninstaller) {
    Write-Output "Running uninstaller..."
    Start-Process $uninstaller -ArgumentList "/VERYSILENT", "/SUPPRESSMSGBOXES", "/NORESTART", "/NOCANCEL" -Wait
}
else {
    Write-Output "Uninstaller not found at: $uninstaller"
}

# 3. Remove leftover config/model data
$leftovers = @(
    "$env:USERPROFILE\\.ollama",
    "$env:APPDATA\\Ollama",
    "$env:LOCALAPPDATA\\Programs\\Ollama"  # Optional: Remove installer folder if still present
)

foreach ($path in $leftovers) {
    if (Test-Path $path) {
        try {
            Write-Output "Removing: $path"
            Remove-Item -Recurse -Force -Path $path
        }
        catch {
            Write-Warning "Failed to remove: $($_.Exception.Message)"
        }
    }
}


Write-Output "Ollama uninstallation and cleanup complete."
`;

export const INSTALL_OLLAMA = `
$Host.UI.RawUI.WindowTitle = "Open2E Setup"
[Console]::Title = "Open2E Setup"

# Run the bundled installer with hidden window
$installerPath = Join-Path $env:ProgramData "Open2E\\Resources\\ollama\\OllamaSetup.exe"

if (-not (Test-Path $installerPath)) {
    Write-Error "Installer not found: $installerPath"
    exit 1
}

Start-Process -FilePath $installerPath -ArgumentList "/VERYSILENT", "/SUPPRESSMSGBOXES", "/NORESTART" -WindowStyle Hidden

Write-Output "Waiting for Ollama installer to complete (including respawns)..."

$goneCount = 0
$requiredGone = 5

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
`;

export const INSTALL_PHI4_MINI = `
$ErrorActionPreference = 'Stop'
$Host.UI.RawUI.WindowTitle = 'Open2E Setup'
[Console]::Title = 'Open2E Setup'

function Write-Log { param([string]$Message) Write-Output $Message }

Write-Log 'Starting phi4-mini installation...'

$zipPath = Join-Path $env:ProgramData 'Open2E\\Resources\\phi4_mini\\phi4_mini_prepack.zip'
if (-not (Test-Path $zipPath)) { Write-Error "Zip file not found: $zipPath"; exit 1 }

$tempDir = Join-Path $env:TEMP 'phi4_mini_prepack'
if (Test-Path $tempDir) { Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue }
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

try { Expand-Archive -Path $zipPath -DestinationPath $tempDir -Force } catch { Write-Error "Failed to extract zip: $_"; exit 1 }

$modelsSourceDir = $null
$candidates = Get-ChildItem -Path $tempDir -Recurse -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -ieq 'models' }
foreach ($cand in $candidates) {
  $hasBlobs = Test-Path (Join-Path $cand.FullName 'blobs')
  $hasManifests = Test-Path (Join-Path $cand.FullName 'manifests')
  if ($hasBlobs -and $hasManifests) { $modelsSourceDir = $cand.FullName; break }
}
if (-not $modelsSourceDir) { $fallback = Join-Path $tempDir 'models'; if (Test-Path $fallback) { $modelsSourceDir = $fallback } }
if (-not $modelsSourceDir) { Write-Error "Could not locate 'models' folder in extracted zip."; exit 1 }

$ollamaDir = Join-Path $env:USERPROFILE '.ollama'
$modelsDir = Join-Path $ollamaDir 'models'
if (-not (Test-Path $ollamaDir)) { New-Item -ItemType Directory -Path $ollamaDir -Force | Out-Null }
if (-not (Test-Path $modelsDir)) { New-Item -ItemType Directory -Path $modelsDir -Force | Out-Null }

try { $svc = Get-Service -Name 'ollama' -ErrorAction SilentlyContinue; if ($svc -and $svc.Status -eq 'Running') { Stop-Service -Name 'ollama' -Force -ErrorAction SilentlyContinue; Start-Sleep -Seconds 1 } } catch {}
try { Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '*ollama*' } | ForEach-Object { try { Stop-Process -Id $_.Id -Force -ErrorAction Stop } catch { & taskkill /F /PID $_.Id 2>$null } } } catch {}

try { Copy-Item -Path (Join-Path $modelsSourceDir '*') -Destination $modelsDir -Recurse -Force -ErrorAction Stop } catch { Write-Error "Copy failed: $_"; exit 1 }

try { Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue } catch {}
Write-Output 'phi4-mini installation complete.'

exit 0
`;

export const INITIALIZE_OLLAMA = `
$Host.UI.RawUI.WindowTitle = 'Open2E Setup'
[Console]::Title = 'Open2E Setup'

$ollamaPath = (Get-Command ollama -ErrorAction SilentlyContinue).Source
if (-not $ollamaPath) {
  $defaultPath = Join-Path $env:LOCALAPPDATA 'Programs\\Ollama\\ollama.exe'
  if (Test-Path $defaultPath) { $ollamaPath = $defaultPath }
}
if (-not $ollamaPath) { Write-Error 'Ollama is not installed.'; exit 1 }

$ollamaProcess = Get-Process -Name 'ollama' -ErrorAction SilentlyContinue
if (-not $ollamaProcess) {
  Start-Process -FilePath $ollamaPath -ArgumentList 'serve' -WindowStyle Hidden
  Start-Sleep -Seconds 5
}
Write-Output 'Ollama is running.'
exit 0
`;
