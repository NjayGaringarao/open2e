use async_openai::{config::OpenAIConfig, Client};

#[tauri::command]
pub async fn validate_key(key: &str) -> Result<bool, String> {
    let cfg = OpenAIConfig::new().with_api_key(key.to_string());
    let client = Client::with_config(cfg);

    match client.models().list().await {
        Ok(_) => Ok(true),
        Err(e) => Err(e.to_string()), // gives you details on why it failed
    }
}
