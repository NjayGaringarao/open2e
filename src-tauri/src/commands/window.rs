use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_store::StoreExt;

#[tauri::command]
pub async fn show_window(app: tauri::AppHandle) -> Result<(), String> {
    // Load the store
    let store = app.store("store.settings").map_err(|e| e.to_string())?;

    // Get the "setup" object
    let setup = store.get("setup");

    let is_initialized = setup
        .and_then(|val| val.get("is_initialized").cloned())
        .and_then(|val| val.as_bool())
        .unwrap_or(false);

    if is_initialized {
        WebviewWindowBuilder::new(&app, "main", WebviewUrl::App("windows/main.html".into()))
            .title("Open 2E: Open Ended Evaluation")
            .min_inner_size(800.0, 600.0)
            .center()
            .build()
            .map_err(|e| e.to_string())?;

        // Close setup window
        if let Some(setup_window) = app.get_webview_window("setup") {
            let _ = setup_window.close();
        }
    } else {
        WebviewWindowBuilder::new(&app, "setup", WebviewUrl::App("windows/setup.html".into()))
            .title("Open2E: Initialization")
            .inner_size(800.0, 600.0)
            .resizable(false)
            .center()
            .build()
            .map_err(|e| e.to_string())?;
    }

    // Close index window
    if let Some(index_window) = app.get_webview_window("index") {
        let _ = index_window.close();
    }

    store.close_resource();
    Ok(())
}
