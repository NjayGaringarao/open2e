use tauri_plugin_system_info::utils::SysInfoState;

#[tauri::command]
pub async fn get_total_memory_gb() -> Result<u64, String> {
    let state = SysInfoState::default();
    let memory = state.sysinfo.lock().unwrap().total_memory();
    let total_memory_in_gb = ((memory as f64) / 1024.0 / 1024.0 / 1024.0).round() as u64;

    // Account for integrated GPU memory reservations
    // Systems with 15GB+ are considered to have 16GB for compatibility
    let adjusted_memory = if total_memory_in_gb >= 15 {
        16
    } else {
        total_memory_in_gb
    };

    Ok(adjusted_memory)
}
