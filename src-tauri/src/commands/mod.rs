pub mod local_setup;
pub mod openai;
pub mod system;
pub mod window;

pub use local_setup::{clean_ollama, download_ollama, install_llm, install_ollama};
pub use openai::validate_key;
pub use system::get_total_memory_gb;
pub use window::show_window;
