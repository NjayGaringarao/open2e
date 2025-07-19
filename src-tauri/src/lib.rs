mod commands;
mod migrations;

use commands::{get_total_memory_gb, initialize_app, load_window, validate_key};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:main.db", migrations::main())
                .add_migrations("sqlite:chat.db", migrations::chat())
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            load_window,
            initialize_app,
            get_total_memory_gb,
            validate_key
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
