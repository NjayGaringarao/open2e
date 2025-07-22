use regex::Regex;
use std::io::{BufRead, BufReader, Read};
use std::process::{Command, Stdio};
use tauri::{AppHandle, Emitter, Manager, Runtime, Window};

#[tauri::command]
pub async fn download_ollama<R: Runtime>(
    app: AppHandle<R>,
    window: Window<R>,
) -> Result<(), String> {
    let script_path = app
        .path()
        .resource_dir()
        .map_err(|e| e.to_string())?
        .join("src/scripts/windows/download_ollama.ps1");

    let mut child = Command::new("powershell")
        .args([
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            script_path.to_str().unwrap(),
        ])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to run script: {}", e))?;

    let stdout = child.stdout.take().ok_or("Failed to capture stdout")?;
    let reader = BufReader::new(stdout);

    for line in reader.lines() {
        let line = line.unwrap_or_default();
        window.emit("ollama-download-progress", &line).ok();
    }

    let status = child.wait().map_err(|e| format!("Failed to wait: {}", e))?;
    if status.success() {
        Ok(())
    } else {
        Err("Download failed".to_string())
    }
}

#[tauri::command]
pub async fn install_ollama(app: AppHandle) -> Result<String, String> {
    // Resolve script path within bundled resources
    let script_path = app
        .path()
        .resource_dir()
        .map_err(|e| e.to_string())?
        .join("src/scripts/windows/install_ollama.ps1");

    // Execute the PowerShell script
    let output = std::process::Command::new("powershell")
        .args(&["-ExecutionPolicy", "Bypass", "-File"])
        .arg(&script_path)
        .output()
        .map_err(|e| format!("Script failed to run: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).into())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).into())
    }
}

#[tauri::command]
pub async fn install_llm(app: AppHandle, window: Window) -> Result<(), String> {
    let script_path = app
        .path()
        .resource_dir()
        .map_err(|e| format!("Resource dir error: {}", e))?
        .join("src/scripts/windows/pull_llm.ps1");

    if !script_path.exists() {
        return Err(format!("Script not found: {}", script_path.display()));
    }

    let mut child = Command::new("powershell")
        .args(&["-ExecutionPolicy", "Bypass", "-File"])
        .arg(script_path)
        .stdout(Stdio::null()) // ignore stdout
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to run script: {}", e))?;

    let stderr = child.stderr.take().ok_or("Failed to capture stderr")?;
    let mut reader = BufReader::new(stderr);
    let mut buffer = [0; 2048];
    let mut partial = String::new();

    // Regex to match lines like: `pulling abc123: 56%`
    let progress_re = Regex::new(r"(?i)pulling .*?:\s*(\d{1,3})%").unwrap();

    loop {
        let n = reader.read(&mut buffer).map_err(|e| e.to_string())?;
        if n == 0 {
            break;
        }

        let text = String::from_utf8_lossy(&buffer[..n]);
        partial.push_str(&text);

        // split by \r or \n to get full lines
        for line in partial
            .split_terminator(['\r', '\n'])
            .map(str::trim)
            .filter(|l| !l.is_empty())
        {
            if let Some(caps) = progress_re.captures(line) {
                if let Ok(percent) = caps[1].parse::<u8>() {
                    window.emit("llm-pull-progress", percent).ok();
                }
            }
        }

        // keep only the trailing part that may be an incomplete line
        if let Some(last) = partial
            .rsplit_once('\r')
            .or_else(|| partial.rsplit_once('\n'))
        {
            partial = last.1.to_string();
        } else {
            partial.clear();
        }
    }

    let status = child.wait().map_err(|e| e.to_string())?;
    if status.success() {
        window.emit("llm-pull-progress", 100u8).ok(); // Force 100% at the end
        Ok(())
    } else {
        Err("Ollama model installation failed".to_string())
    }
}

#[tauri::command]
pub async fn clean_ollama(app: AppHandle) -> Result<String, String> {
    // Resolve script path within bundled resources
    let script_path = app
        .path()
        .resource_dir()
        .map_err(|e| e.to_string())?
        .join("src/scripts/windows/clean_ollama.ps1");

    // Execute the PowerShell script
    let output = std::process::Command::new("powershell")
        .args(&["-ExecutionPolicy", "Bypass", "-File"])
        .arg(&script_path)
        .output()
        .map_err(|e| format!("Script failed to run: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).into())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).into())
    }
}
