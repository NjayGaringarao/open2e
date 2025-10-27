import { Command } from "@tauri-apps/plugin-shell";
import { emit } from "@tauri-apps/api/event";
import { resolveResource } from "@tauri-apps/api/path";

// Progress tracking regex patterns
const PROGRESS_REGEX = /(\d{1,3})%/;
const PULL_PROGRESS_REGEX = /pulling .*?:\s*(\d{1,3})%/i;

/**
 * Helper function to run a PowerShell script
 */
async function runPowerShellScript(scriptName: string) {
  // Resolve the script path from bundled resources
  const scriptPath = await resolveResource(`src/scripts/windows/${scriptName}`);

  // Create command with resolved path
  const command = Command.create("run-powershell", [
    "-ExecutionPolicy",
    "Bypass",
    "-NoProfile",
    "-WindowStyle",
    "Hidden",
    "-File",
    scriptPath,
  ]);

  return await command.execute();
}

/**
 * Download Ollama installer
 */
export const downloadOllama = async (): Promise<void> => {
  try {
    const result = await runPowerShellScript("download_ollama.ps1");

    // Parse output for progress updates
    if (result.stdout) {
      const lines = result.stdout.split(/\r?\n/);

      for (const line of lines) {
        const match = line.match(PROGRESS_REGEX);
        if (match) {
          const percent = parseInt(match[1]);
          emit("ollama-download-progress", percent.toString());
        }
      }
    }

    if (result.code !== 0) {
      const errorMessage = `Download failed with exit code ${result.code}`;
      const fullError = `${errorMessage}\nStdout: ${result.stdout}\nStderr: ${result.stderr}`;
      console.error("Download ollama error:", fullError);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Download ollama error:", error);
    throw error;
  }
};

/**
 * Install Ollama
 */
export const installOllama = async (): Promise<void> => {
  try {
    const result = await runPowerShellScript("install_ollama.ps1");

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
 * Pull LLM model (phi4-mini)
 */
export const installLLM = async (): Promise<void> => {
  try {
    const result = await runPowerShellScript("pull_llm.ps1");

    // Parse stderr for progress updates (Ollama outputs progress to stderr)
    if (result.stderr) {
      const lines = result.stderr.split(/\r?\n/);

      for (const line of lines) {
        const match = line.match(PULL_PROGRESS_REGEX);
        if (match) {
          const percent = parseInt(match[1]);
          emit("llm-pull-progress", percent);
        }
      }
    }

    if (result.code !== 0) {
      const errorMessage = `LLM installation failed with exit code ${result.code}`;
      const fullError = `${errorMessage}\nStdout: ${result.stdout}\nStderr: ${result.stderr}`;
      console.error("Install LLM error:", fullError);
      throw new Error(errorMessage);
    }

    // Force 100% at the end
    emit("llm-pull-progress", 100);
  } catch (error) {
    console.error("Install LLM error:", error);
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
