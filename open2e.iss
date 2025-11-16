; Open2E Inno Setup Script
; - Shows EULA & LICENSE
; - Deploys application binaries and helper script
; - Runs PowerShell helper to set Ollama environment variable

#define MyAppName "Open2E"
#define MyAppVersion "0.5.0"
#define MyAppPublisher "Njay Garingarao"
#define MyAppPublisherURL "https://github.com/NjayGaringarao"
#define MyAppURL "https://open2e.vercel.app"
#define MyAppExeName "Open2E.exe"

[Setup]
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppPublisherURL}
AppSupportURL={#MyAppURL}
DefaultDirName={commonpf}\\Open2E
DefaultGroupName=Open2E
OutputDir=dist\\installer
OutputBaseFilename=Open2E_Setup_{#MyAppVersion}
Compression=lzma
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=admin
LicenseFile=EULA.txt
SetupIconFile=src-tauri\icons\icon.ico
WizardImageFile=src-tauri\icons\128x128.png
WizardSmallImageFile=src-tauri\icons\128x128.png
UninstallDisplayIcon={app}\\{#MyAppExeName}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
; App binaries (built by Tauri)
Source: "src-tauri\\target\\release\\Open2E.exe"; DestDir: "{app}"; Flags: ignoreversion
; PowerShell scripts (for setting ollama endpoint)
Source: "src-tauri\\src\\scripts\\set_ollama_variable.ps1"; DestDir: "{app}\\scripts"; Flags: ignoreversion

; Licenses
Source: "LICENSE.md"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\\{#MyAppName}"; Filename: "{app}\\{#MyAppExeName}"; IconFilename: "{app}\\{#MyAppExeName}"
Name: "{group}\\Uninstall {#MyAppName}"; Filename: "{uninstallexe}"

; Desktop shortcut
Name: "{autodesktop}\\{#MyAppName}"; Filename: "{app}\\{#MyAppExeName}"; IconFilename: "{app}\\{#MyAppExeName}"

[Run]
; Run Ollama variable setup
Filename: "powershell.exe"; \
Parameters: "-ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -File ""{app}\scripts\set_ollama_variable.ps1"""; \
StatusMsg: "Configuring Ollama environment variable..."; Flags: runhidden waituntilterminated


; Launch app after install
Filename: "{app}\\{#MyAppExeName}"; Description: "Launch {#MyAppName}"; Flags: nowait postinstall skipifsilent

[InstallDelete]
Type: filesandordirs; Name: "{commonappdata}\\Open2E"


