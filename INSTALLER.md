# Open2E Installer (Inno Setup)

This document explains how to build and operate the Windows installer powered by Inno Setup. It covers prerequisites, build steps, conditional local‑AI install, reinstall/repair, registry flags, and troubleshooting.

## Prerequisites

- Node.js + npm
- Rust toolchain (stable) and Tauri CLI
- Inno Setup 6.x installed and `iscc` available on PATH
  - Typical path: `C:\Program Files (x86)\Inno Setup 6\ISCC.exe`
  - Note: The installer script is `open2e.iss` (not `installer.iss`)

## Installer contents

- App binaries: `src-tauri/target/release/Open2E.exe`
- Scripts: `src-tauri/src/scripts/*.ps1`
- Icons: `src-tauri/icons/icon.ico`, `src-tauri/icons/icon.png` (for installer wedges/shortcuts)
- Local AI payloads (large, optional):
  - `src-tauri/resources/ollama/OllamaSetup.exe`
  - `src-tauri/resources/phi4_mini/phi4_mini_prepack.zip`
- Licenses: `LICENSE.md`, `EULA.md` (+ third‑party licenses under app/licenses/)

## Conditional local‑AI installation

- RAM check at install time (approx): if RAM ≥ 16 GB, task “Install local AI (Ollama + phi4‑mini)” is auto‑checked. If < 16 GB, it is unchecked.
- The user can override the default by checking/unchecking the task.
- If selected, the installer will:
  1. Copy payloads to `C:\ProgramData\Open2E\Resources\...`
  2. Run `install_ollama.ps1` and `install_phi4_mini.ps1`
  3. Run `initialize_ollama.ps1`

## Registry flags written by installer

- Key: `HKCU\Software\Open2E`
  - `SetupCompleted` (DWORD): 1 after successful install
  - `LocalAIInstalled` (DWORD): 1 if local AI was installed, else 0
  - `SystemMemoryGB` (DWORD): detected RAM (approx GB)

The app checks `SetupCompleted` to decide which window to show on first launch. The welcome screen sets `is_initialized` in the Tauri store to skip on future launches.

## Shared resource cache

- Location: `C:\ProgramData\Open2E\Resources\`
  - `ollama/` → bundled Ollama installer
  - `phi4_mini/` → prepacked model zip (expanded by script into user’s `.ollama/models`)
  - `scripts/` → PowerShell scripts
- This location is used for first install and for later repairs/reinstalls.

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

- Output: `dist/installer/Open2E_Setup_0.3.0.exe` (filename includes version number)

## Reinstall / Repair

- Running the installer again will:
  - Update `Open2E.exe` and scripts
  - Update Start Menu shortcut
  - Refresh registry flags
  - If the "Install local AI" task is checked, scripts run again (idempotent):
    - Ollama service is stopped if running
    - Model files are copied/updated
    - Ollama is initialized
- If the user unchecks the task on repair, local AI is not reinstalled; `LocalAIInstalled` will reflect the task selection.
- Desktop shortcut: Created if "Create desktop icon" task is checked, not affected by existing shortcut

## Uninstall

- Removes `C:\Program Files\Open2E\` (app directory)
- Removes Start Menu shortcuts (Open2E group and Uninstall entry)
- Removes Desktop shortcut (if it was created)
- Removes `C:\ProgramData\Open2E\Resources\` (scripts and payload folders)
- Removes registry keys under `HKCU\Software\Open2E` (including SetupCompleted, LocalAIInstalled, SystemMemoryGB)
- Does not remove user data in `%USERPROFILE%` (e.g., `.ollama/models`)

## Verification checklist

- After install:
  - `HKCU\Software\Open2E\SetupCompleted = 1`
  - `LocalAIInstalled` matches the selected task
  - `SystemMemoryGB` is set
  - `C:\Program Files\Open2E\Open2E.exe` exists
  - Start Menu shortcut created under `Open2E` group
  - (Optional) Desktop shortcut if "Create desktop icon" task was checked
  - App appears in Windows Settings > Apps with proper icon
  - If local AI was selected:
    - Ollama service is installed and can start
    - `.ollama/models` contains phi4‑mini blobs/manifests

## Troubleshooting

- `iscc` not found: add Inno Setup to PATH or use its full path
- Installer size too large: large payloads are now handled by Inno Setup; ensure they are not listed in `tauri.conf.json -> bundle.resources`
- Script failures:
  - Run PowerShell as admin and execute scripts manually from `C:\ProgramData\Open2E\Resources\scripts`
  - Check temp logs: the `install_phi4_mini.ps1` writes logs under `%TEMP%\open2e_phi4_mini_install.log`
- Ollama conflicts:
  - Ensure no running `ollama*` processes; scripts attempt to stop/kill before copying

## Installer UI and icons

The installer displays branded UI elements:

- Installer file icon: sourced from `src-tauri/icons/icon.ico`
- Wizard left sidebar image: `src-tauri/icons/icon.png`
- Wizard top-right small image: `src-tauri/icons/icon.png`
- Uninstaller icon in Settings: reads from the executable icon
- Start Menu shortcut icon: reads from the executable icon
- Desktop shortcut icon: reads from the executable icon

The executable's embedded icon comes from `src-tauri/icons/icon.ico` (set in `tauri.conf.json`).

## Installer tasks

Two optional tasks appear during installation:

1. "Install local AI (Ollama + phi4-mini)" - Auto-checked if RAM ≥ 16 GB
2. "Create a desktop icon" - Unchecked by default (user can opt-in)

## File map (key files)

```
open2e.iss                                      ; Inno Setup script
INSTALLER.md                                    ; This guide
EULA.md                                         ; End user license agreement (shown in installer)
src-tauri/icons/icon.ico                        ; App icon (embedded in exe, used in installer)
src-tauri/icons/icon.png                        ; Installer wizard images
src-tauri/tauri.conf.json                       ; Tauri bundle config (no large payloads)
src-tauri/src/commands/window.rs                ; Registry check for SetupCompleted
src/pages/setup/{layout.tsx,Welcome.tsx}        ; Post-install welcome only
src-tauri/src/scripts/*.ps1                     ; Install/initialize scripts
src-tauri/resources/{ollama,phi4_mini}/...      ; Payloads used by installer
```

## Notes

- Current version: **0.3.0** (defined in `open2e.iss` as `MyAppVersion`)
- The RAM check is a coarse estimate (based on OS‑reported memory). Users can always override the local AI task selection.
- You can read `LocalAIInstalled` at runtime to adjust UI (optional).
- All icons are sourced from the executable's embedded icon resource (`src-tauri/icons/icon.ico`). The installer wizard images use `.png` versions for better scaling.
- The installer displays the EULA (`EULA.md`) during installation as per `LicenseFile` directive.
