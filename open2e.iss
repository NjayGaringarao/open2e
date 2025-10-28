; Open2E Inno Setup Script
; - Shows EULA & LICENSE
; - Checks RAM and conditionally installs local AI (Ollama + phi4-mini)
; - Extracts resources to ProgramData and runs PowerShell scripts
; - Writes registry flags for app to detect on first run

#define MyAppName "Open2E"
#define MyAppVersion "0.3.0"
#define MyAppPublisher "Open2E"
#define MyAppURL "https://open2e.vercel.app"
#define MyAppExeName "Open2E.exe"

[Setup]
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={pf}\\Open2E
DefaultGroupName=Open2E
OutputDir=dist\\installer
OutputBaseFilename=Open2E_Setup_{#MyAppVersion}
Compression=lzma
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=admin
LicenseFile=EULA.md
SetupIconFile=src-tauri\icons\icon.ico
WizardImageFile=src-tauri\icons\icon.png
WizardSmallImageFile=src-tauri\icons\icon.png
UninstallDisplayIcon={app}\\{#MyAppExeName}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: installlocalai; Description: "Install local AI (Not Recommended for Systems with less than 16GB of RAM)"; Flags: unchecked
Name: desktopicon; Description: "Create a &desktop icon"; Flags: unchecked

[Files]
; App binaries (built by Tauri)
Source: "src-tauri\\target\\release\\Open2E.exe"; DestDir: "{app}"; Flags: ignoreversion
; PowerShell scripts (for repairs/uninstall assistance)
Source: "src-tauri\\src\\scripts\\install_ollama.ps1"; DestDir: "{commonappdata}\\Open2E\\Resources\\scripts"; Flags: ignoreversion
Source: "src-tauri\\src\\scripts\\install_phi4_mini.ps1"; DestDir: "{commonappdata}\\Open2E\\Resources\\scripts"; Flags: ignoreversion
Source: "src-tauri\\src\\scripts\\initialize_ollama.ps1"; DestDir: "{commonappdata}\\Open2E\\Resources\\scripts"; Flags: ignoreversion
Source: "src-tauri\\src\\scripts\\clean_ollama.ps1"; DestDir: "{commonappdata}\\Open2E\\Resources\\scripts"; Flags: ignoreversion
; Local AI payloads (conditionally installed)
Source: "src-tauri\\resources\\ollama\\OllamaSetup.exe"; DestDir: "{commonappdata}\\Open2E\\Resources\\ollama"; Flags: ignoreversion; Tasks: installlocalai
Source: "src-tauri\\resources\\phi4_mini\\phi4_mini_prepack.zip"; DestDir: "{commonappdata}\\Open2E\\Resources\\phi4_mini"; Flags: ignoreversion; Tasks: installlocalai
; Licenses
Source: "LICENSE.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "src-tauri\\resources\\ollama\\LICENSE"; DestDir: "{app}\\licenses\\ollama"; Flags: ignoreversion
Source: "src-tauri\\resources\\phi4_mini\\LICENSE"; DestDir: "{app}\\licenses\\phi4_mini"; Flags: ignoreversion

[Dirs]
Name: "{commonappdata}\\Open2E\\Resources\\ollama"; Flags: uninsalwaysuninstall
Name: "{commonappdata}\\Open2E\\Resources\\phi4_mini"; Flags: uninsalwaysuninstall
Name: "{commonappdata}\\Open2E\\Resources\\scripts"; Flags: uninsalwaysuninstall

[Icons]
Name: "{group}\\{#MyAppName}"; Filename: "{app}\\{#MyAppExeName}"; IconFilename: "{app}\\{#MyAppExeName}"
Name: "{group}\\Uninstall {#MyAppName}"; Filename: "{uninstallexe}"

; Desktop shortcut
Name: "{autodesktop}\\{#MyAppName}"; Filename: "{app}\\{#MyAppExeName}"; IconFilename: "{app}\\{#MyAppExeName}"; Tasks: desktopicon

[Run]
; Conditionally run dependency installers when task selected
Filename: "powershell.exe"; \
Parameters: "-ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -File ""{commonappdata}\Open2E\Resources\scripts\install_ollama.ps1"" ""{commonappdata}\Open2E\Resources\ollama\OllamaSetup.exe"""; \
StatusMsg: "Installing Ollama..."; Flags: runhidden waituntilterminated; Tasks: installlocalai

Filename: "powershell.exe"; \
Parameters: "-ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -File ""{commonappdata}\Open2E\Resources\scripts\install_phi4_mini.ps1"" ""{commonappdata}\Open2E\Resources\phi4_mini\phi4_mini_prepack.zip"""; \
StatusMsg: "Installing phi4-mini (prepacked)..."; Flags: runhidden waituntilterminated; Tasks: installlocalai

Filename: "powershell.exe"; \
Parameters: "-ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -File ""{commonappdata}\Open2E\Resources\scripts\initialize_ollama.ps1"""; \
StatusMsg: "Initializing Ollama service..."; Flags: runhidden waituntilterminated; Tasks: installlocalai


; Launch app after install
Filename: "{app}\\{#MyAppExeName}"; Description: "Launch {#MyAppName}"; Flags: nowait postinstall skipifsilent

[InstallDelete]
Type: filesandordirs; Name: "{commonappdata}\\Open2E\\Resources\\phi4_mini\\phi4_mini_prepack.tmp"

[Registry]
; Set completion and memory flags for the app
Root: HKCU; Subkey: "Software\\Open2E"; ValueType: dword; ValueName: "SetupCompleted"; ValueData: "1"; Flags: uninsdeletekeyifempty

[Code]

const
  LOCAL_AI_THRESHOLD_GB = 16;

type
  TMemoryStatusEx = record
    dwLength: Cardinal;
    dwMemoryLoad: Cardinal;
    ullTotalPhysLow: Cardinal;
    ullTotalPhysHigh: Cardinal;
    ullAvailPhysLow: Cardinal;
    ullAvailPhysHigh: Cardinal;
    ullTotalPageFileLow: Cardinal;
    ullTotalPageFileHigh: Cardinal;
    ullAvailPageFileLow: Cardinal;
    ullAvailPageFileHigh: Cardinal;
    ullTotalVirtualLow: Cardinal;
    ullTotalVirtualHigh: Cardinal;
    ullAvailVirtualLow: Cardinal;
    ullAvailVirtualHigh: Cardinal;
    ullAvailExtendedVirtualLow: Cardinal;
    ullAvailExtendedVirtualHigh: Cardinal;
  end;

function GlobalMemoryStatusEx(var lpBuffer: TMemoryStatusEx): Boolean;
  external 'GlobalMemoryStatusEx@kernel32.dll stdcall';

function GetRAMInGB: Integer;
var
  ms: TMemoryStatusEx;
  totalBytes: Double;
begin
  ms.dwLength := SizeOf(ms);
  if GlobalMemoryStatusEx(ms) then
  begin
    totalBytes := (Double(ms.ullTotalPhysHigh) * 4294967296.0) + Double(ms.ullTotalPhysLow);
    Result := Round(totalBytes / (1024 * 1024 * 1024));
  end
  else
    Result := 0;
end;

var
  RamGB: Integer;
  WantLocalAI: Boolean;

procedure InitializeWizard;
var
  i: Integer;
  RamGB: Integer;
begin
  RamGB := GetRAMInGB;
  Log(Format('Detected RAM: %d GB', [RamGB]));

  for i := 0 to WizardForm.TasksList.Items.Count - 1 do
  begin
    if CompareText(WizardForm.TasksList.Items[i], 'Install local AI (Ollama + phi4-mini)') = 0 then
    begin
      if RamGB >= LOCAL_AI_THRESHOLD_GB then
      begin
        WizardForm.TasksList.Checked[i] := True;
        MsgBox(Format('Detected %dGB RAM — Local AI installation will be enabled.', [RamGB]),
          mbInformation, MB_OK);
      end
      else
      begin
        WizardForm.TasksList.Checked[i] := False;
        MsgBox(Format('Detected only %dGB RAM — Local AI installation is disabled.', [RamGB]),
          mbInformation, MB_OK);
      end;
      Break;
    end;
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  LocalAIInstalled: Integer;
begin
  if CurStep = ssInstall then
    WantLocalAI := WizardIsTaskSelected('installlocalai');

  if CurStep = ssPostInstall then
  begin
    if WantLocalAI then LocalAIInstalled := 1 else LocalAIInstalled := 0;
    RegWriteDWordValue(HKCU, 'Software\\Open2E', 'LocalAIInstalled', LocalAIInstalled);
    RegWriteDWordValue(HKCU, 'Software\\Open2E', 'SystemMemoryGB', RamGB);
    RegWriteDWordValue(HKCU, 'Software\\Open2E', 'SetupCompleted', 1);
  end;
end;
