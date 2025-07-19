use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_store::StoreExt;
use tauri_plugin_system_info::utils::SysInfoState;

#[tauri::command]
pub async fn initialize_app(app: tauri::AppHandle) -> Result<(), String> {
    // TODO: Implement initialization logic.
    // FOR NOW: Just show main window.

    let _main =
        WebviewWindowBuilder::new(&app, "main", WebviewUrl::App("windows/main.html".into()))
            .title("Open 2E: Open Ended Evaluation")
            .min_inner_size(800.0, 600.0)
            .center()
            .build()
            .map_err(|e| e.to_string())?;

    // Closes the splash/index window
    if let Some(index_window) = app.get_webview_window("setup") {
        let _ = index_window.close();
    }

    Ok(())
}

#[tauri::command]
pub async fn load_window(app: tauri::AppHandle) -> Result<(), String> {
    // Load or create the store and add it to the app's resources
    let store = app.store("store.json").map_err(|e| e.to_string())?;

    // Check initialization of the app.
    let value = store.get("is_initialized");
    match value {
        Some(serde_json::Value::Bool(true)) => {
            let _main = WebviewWindowBuilder::new(
                &app,
                "main",
                WebviewUrl::App("windows/main.html".into()),
            )
            .title("Open 2E: Open Ended Evaluation")
            .min_inner_size(800.0, 600.0)
            .center()
            .build()
            .map_err(|e| e.to_string())?;
        }
        _ => {
            let _setup = WebviewWindowBuilder::new(
                &app,
                "setup",
                WebviewUrl::App("windows/setup.html".into()),
            )
            .title("Open2E: Initialization")
            .inner_size(800.0, 600.0)
            .resizable(false)
            .center()
            .build()
            .map_err(|e| e.to_string())?;
        }
    }

    // Closes the splash/index window
    if let Some(index_window) = app.get_webview_window("index") {
        let _ = index_window.close();
    }

    store.close_resource();
    Ok(())
}

#[tauri::command]
pub async fn get_total_memory_gb() -> Result<u64, String> {
    let state = SysInfoState::default();
    let memory = state.sysinfo.lock().unwrap().total_memory();
    let total_memory_in_gb = ((memory as f64) / 1024.0 / 1024.0 / 1024.0).round() as u64;
    Ok(total_memory_in_gb)
}
