use tauri_plugin_system_info::utils::SysInfoState;

#[tauri::command]
pub async fn get_total_memory_gb() -> Result<u64, String> {
    let state = SysInfoState::default();
    let memory = state.sysinfo.lock().unwrap().total_memory();
    let total_memory_in_gb = ((memory as f64) / 1024.0 / 1024.0 / 1024.0).round() as u64;
    Ok(total_memory_in_gb)
}
