// pub mod ollama; // Archived - replaced by frontend shell plugin
pub mod system;
pub mod window;

// pub use ollama::{clean_ollama, download_ollama, initialize_ollama, install_llm, install_ollama}; // Archived
pub use system::get_total_memory_gb;
pub use window::show_window;
