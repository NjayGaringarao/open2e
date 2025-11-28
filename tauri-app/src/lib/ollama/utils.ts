import { Command } from "@tauri-apps/plugin-shell";

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

export const IS_LOCAL_LLM_INSTALLED = `
$ollamaPath = (Get-Command ollama -ErrorAction SilentlyContinue).Source
if (-not $ollamaPath) {
  $defaultPath = Join-Path $env:LOCALAPPDATA 'Programs\\Ollama\\ollama.exe'
  if (Test-Path $defaultPath) { $ollamaPath = $defaultPath }
}
if (-not $ollamaPath) { Write-Error 'Ollama is not installed.'; exit 1 }

try {
  $modelsOutput = & $ollamaPath list 2>$null
} catch {
  Write-Error 'Failed to list Ollama models.'
  exit 1
}

if ($modelsOutput -match 'phi4-mini') {
  exit 0
}

Write-Error 'phi4-mini model is not installed.'
exit 1
`;

function toBase64Utf16Le(text: string): string {
  const u16 = new Uint16Array(text.length);
  for (let i = 0; i < text.length; i++) {
    u16[i] = text.charCodeAt(i);
  }
  const bytes = new Uint8Array(u16.buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // btoa is available in the webview
  return btoa(binary);
}

async function runPowerShellInline(script: string) {
  const encoded = toBase64Utf16Le(script);
  const command = Command.create("run-powershell", [
    "-NoProfile",
    "-NonInteractive",
    "-ExecutionPolicy",
    "Bypass",
    "-WindowStyle",
    "Hidden",
    "-EncodedCommand",
    encoded,
  ]);
  return await command.execute();
}

/**
 * Initialize Ollama service
 */
export const initializeOllama = async (): Promise<void> => {
  try {
    const result = await runPowerShellInline(INITIALIZE_OLLAMA);

    if (result.code !== 0) {
      const errorMessage = `Ollama initialization failed with exit code ${result.code}`;
      const fullError = `${errorMessage}\nStdout: ${result.stdout}\nStderr: ${result.stderr}`;
      console.error("Initialize ollama error:", fullError);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Initialize ollama error:", error);
    throw error;
  }
};

export const isLocalLLMInstalled = async (): Promise<boolean> => {
  try {
    const result = await runPowerShellInline(IS_LOCAL_LLM_INSTALLED);
    if (result.code !== 0) {
      console.warn(
        "Local LLM installation check failed:",
        `code=${result.code}`,
        `stdout=${result.stdout}`,
        `stderr=${result.stderr}`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Local LLM installation check error:", error);
    return false;
  }
};
