import { Command } from "@tauri-apps/plugin-shell";
import { emit } from "@tauri-apps/api/event";
import { resolveResource } from "@tauri-apps/api/path";

// Progress tracking regex patterns
const PROGRESS_REGEX = /(\d{1,3})%/;
const PULL_PROGRESS_REGEX = /pulling .*?:\s*(\d{1,3})%/i;

/**
 * Helper function to run a PowerShell script with optional arguments
 */
async function runPowerShellScript(scriptName: string, args: string[] = []) {
  // Resolve the script path from bundled resources
  const scriptPath = await resolveResource(`src/scripts/${scriptName}`);

  // Create command with resolved path
  const command = Command.create("run-powershell", [
    "-ExecutionPolicy",
    "Bypass",
    "-NoProfile",
    "-WindowStyle",
    "Hidden",
    "-File",
    scriptPath,
    ...args,
  ]);

  return await command.execute();
}

/**
 * Download Ollama installer - No longer needed, returns immediately
 */
export const downloadOllama = async (): Promise<void> => {
  // Instantly complete since installer is bundled
  emit("ollama-download-progress", "100");
};

/**
 * Install Ollama using bundled installer
 */
export const installOllama = async (): Promise<void> => {
  try {
    // Resolve bundled installer path
    const installerPath = await resolveResource(
      "resources/ollama/OllamaSetup.exe"
    );

    // Pass installer path as argument to the script
    const result = await runPowerShellScript("install_ollama.ps1", [
      installerPath,
    ]);

    if (result.code !== 0) {
      const errorMessage = `Installation failed with exit code ${result.code}`;
      const fullError = `${errorMessage}\nStdout: ${result.stdout}\nStderr: ${result.stderr}`;
      console.error("Install ollama error:", fullError);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Install ollama error:", error);
    throw error;
  }
};

/**
 * Install phi4-mini model by extracting bundled zip
 */
export const installPhi4Mini = async (): Promise<void> => {
  try {
    // Resolve bundled zip file path
    const zipPath = await resolveResource(
      "resources/phi4_mini/phi4_mini_prepack.zip"
    );

    // Pass zip path as argument to the script
    const result = await runPowerShellScript("install_phi4_mini.ps1", [
      zipPath,
    ]);

    if (result.code !== 0) {
      const errorMessage = `Phi4-mini installation failed with exit code ${result.code}`;
      const fullError = `${errorMessage}\nStdout: ${result.stdout}\nStderr: ${result.stderr}`;
      console.error("Install phi4-mini error:", fullError);
      throw new Error(errorMessage);
    }

    // Emit progress event for completion
    emit("phi4-mini-install-progress", 100);
  } catch (error) {
    console.error("Install phi4-mini error:", error);
    throw error;
  }
};

/**
 * Initialize Ollama service
 */
export const initializeOllama = async (): Promise<void> => {
  try {
    const result = await runPowerShellScript("initialize_ollama.ps1");

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

/**
 * Clean/uninstall Ollama
 */
export const cleanOllama = async (): Promise<void> => {
  try {
    const result = await runPowerShellScript("clean_ollama.ps1");

    if (result.code !== 0) {
      const errorMessage = `Ollama cleanup failed with exit code ${result.code}`;
      const fullError = `${errorMessage}\nStdout: ${result.stdout}\nStderr: ${result.stderr}`;
      console.error("Clean ollama error:", fullError);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Clean ollama error:", error);
    throw error;
  }
};
