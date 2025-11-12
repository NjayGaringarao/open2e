# Open2E Installer (Inno Setup)

This document explains how to build and operate the Windows installer powered by Inno Setup. It covers prerequisites, build steps, and troubleshooting.

## Prerequisites

- Node.js + npm
- Rust toolchain (stable) and Tauri CLI
- Inno Setup 6.x installed and `iscc` available on PATH
  - Typical path: `C:\Program Files (x86)\Inno Setup 6\ISCC.exe`
  - Note: The installer script is `open2e.iss` (not `installer.iss`)

## Installer contents

- App binaries: `src-tauri/target/release/Open2E.exe`
- Helper script: `src-tauri/src/scripts/set_ollama_variable.ps1`
- Icons: `src-tauri/icons/icon.ico`, `src-tauri/icons/icon.png` (for installer UI and shortcuts)
- Licenses: `LICENSE.md`, `EULA.txt` (+ any third‑party licenses under app/licenses/)

## Build steps

1. Build web and desktop binaries:

```bash
npm run build:tauri
```

2. Build the Inno Setup installer:

```bash
npm run build:installer
```

Or manually from PowerShell:

```powershell
& "C:\Program Files (x86)\Inno Setup 6\ISCC.exe" .\open2e.iss
```

3. One‑shot pipeline:

```bash
npm run build:release
```

- Output: `dist/installer/Open2E_Setup_0.4.0.exe` (filename includes version number)

## Reinstall / Repair

- Running the installer again will:
  - Update `Open2E.exe` and scripts
  - Update Start Menu shortcut
- Refresh registry values
- Re-run `set_ollama_variable.ps1` to ensure the Ollama endpoint variable is set
- Desktop shortcut: recreated if missing

## Uninstall

- Removes `C:\Program Files\Open2E\` (app directory)
- Removes Start Menu shortcuts (Open2E group and Uninstall entry)
- Removes Desktop shortcut (if it was created)
- Removes `C:\ProgramData\Open2E\` if present
- Does not remove user data in `%USERPROFILE%` (e.g., `.ollama/models`)

## Verification checklist

- After install:
  - `store.config` contains `setup_completed = true` once the welcome flow finishes
  - `C:\Program Files\Open2E\Open2E.exe` exists
  - Start Menu shortcut created under `Open2E` group
  - Desktop shortcut appears (if not removed manually)
  - App appears in Windows Settings > Apps with proper icon

## Troubleshooting

- `iscc` not found: add Inno Setup to PATH or use its full path
- Script failures:
  - Run PowerShell as admin and execute `"{app}\scripts\set_ollama_variable.ps1"` manually
  - Confirm the variable value with `Get-Item Env:OLLAMA_HOST`

## Installer UI and icons

The installer displays branded UI elements:

- Installer file icon: sourced from `src-tauri/icons/icon.ico`
- Wizard left sidebar image: `src-tauri/icons/icon.png`
- Wizard top-right small image: `src-tauri/icons/icon.png`
- Uninstaller icon in Settings: reads from the executable icon
- Start Menu shortcut icon: reads from the executable icon
- Desktop shortcut icon: reads from the executable icon

The executable's embedded icon comes from `src-tauri/icons/icon.ico` (set in `tauri.conf.json`).

## File map (key files)

```
open2e.iss                                      ; Inno Setup script
INSTALLER.md                                    ; This guide
EULA.txt                                        ; End user license agreement (shown in installer)
src-tauri/icons/icon.ico                        ; App icon (embedded in exe, used in installer)
src-tauri/icons/icon.png                        ; Installer wizard images
src-tauri/tauri.conf.json                       ; Tauri bundle config (no large payloads)
src-tauri/src/commands/window.rs                ; Loads setup state from Tauri store
src/pages/setup/{layout.tsx,Welcome.tsx}        ; Post-install welcome only
src-tauri/src/scripts/set_ollama_variable.ps1   ; Configures Ollama endpoint during install
```

## Notes

- Current version: **0.4.0** (defined in `open2e.iss` as `MyAppVersion`)
- The installer no longer provisions local AI models; it only configures the Ollama endpoint variable.
- All icons are sourced from the executable's embedded icon resource (`src-tauri/icons/icon.ico`). The installer wizard images use `.png` versions for better scaling.
- The installer displays the EULA (`EULA.txt`) during installation as per the `LicenseFile` directive.
