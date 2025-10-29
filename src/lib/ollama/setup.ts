import { Command } from "@tauri-apps/plugin-shell";
import {
  CLEAN_OLLAMA,
  INITIALIZE_OLLAMA,
  INSTALL_OLLAMA,
  INSTALL_PHI4_MINI,
} from "./scripts";

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
 * Install Ollama using bundled installer
 */
export const installOllama = async (): Promise<void> => {
  try {
    const result = await runPowerShellInline(INSTALL_OLLAMA);

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
    const result = await runPowerShellInline(INSTALL_PHI4_MINI);

    if (result.code !== 0) {
      const errorMessage = `Phi4-mini installation failed with exit code ${result.code}`;
      const fullError = `${errorMessage}\nStdout: ${result.stdout}\nStderr: ${result.stderr}`;
      console.error("Install phi4-mini error:", fullError);
      throw new Error(errorMessage);
    }
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

/**
 * Clean/uninstall Ollama
 */
export const cleanOllama = async (): Promise<void> => {
  try {
    // Keep using file-based script for cleanup (can be elevated from installer if needed)
    const result = await runPowerShellInline(CLEAN_OLLAMA);

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
