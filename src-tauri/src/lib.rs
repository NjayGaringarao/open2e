mod commands;
mod migrations;

use commands::{
    clean_ollama, download_ollama, get_total_memory_gb, initialize_ollama, install_llm,
    install_ollama, show_window,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:evaluator.db", migrations::evaluator())
                .add_migrations("sqlite:learner.db", migrations::learner())
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            show_window,
            get_total_memory_gb,
            install_ollama,
            download_ollama,
            install_llm,
            initialize_ollama,
            clean_ollama,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
