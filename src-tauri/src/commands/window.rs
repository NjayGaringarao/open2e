use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_store::StoreExt;

#[tauri::command]
pub async fn show_window(app: tauri::AppHandle) -> Result<(), String> {
    // Load the store
    let config = app.store("store.config").map_err(|e| e.to_string())?;

    let is_initialized = matches!(
        config.get("is_initialized"),
        Some(serde_json::Value::Bool(true))
    );
    let setup_completed = matches!(
        config.get("setup_completed"),
        Some(serde_json::Value::Bool(true))
    ) || is_initialized;

    match (setup_completed, is_initialized) {
        (true, true) => {
            WebviewWindowBuilder::new(&app, "main", WebviewUrl::App("windows/main.html".into()))
                .title("Open 2E: Open Ended Evaluation")
                .min_inner_size(940.0, 540.0)
                .center()
                .build()
                .map_err(|e| e.to_string())?;

            // Close setup window
            if let Some(setup_window) = app.get_webview_window("setup") {
                let _ = setup_window.close();
            }
        }
        // Installer completed but app not initialized yet → show Welcome (setup.html)
        (true, false) => {
            WebviewWindowBuilder::new(&app, "setup", WebviewUrl::App("windows/setup.html".into()))
                .title("Open2E: Initialization")
                .inner_size(800.0, 600.0)
                .resizable(false)
                .maximizable(false)
                .center()
                .build()
                .map_err(|e| e.to_string())?;
        }
        // Installer did not complete (fallback) → show setup window
        (false, _) => {
            WebviewWindowBuilder::new(&app, "setup", WebviewUrl::App("windows/setup.html".into()))
                .title("Open2E: Initialization")
                .inner_size(800.0, 600.0)
                .resizable(false)
                .maximizable(false)
                .center()
                .build()
                .map_err(|e| e.to_string())?;
        }
    }

    // Close index window
    if let Some(index_window) = app.get_webview_window("index") {
        let _ = index_window.close();
    }

    config.close_resource();
    Ok(())
}
