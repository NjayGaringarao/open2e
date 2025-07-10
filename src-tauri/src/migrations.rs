use tauri_plugin_sql::{Migration, MigrationKind};

pub fn main() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create all tables",
        sql: include_str!("./migrations/000_create_main.sql"),
        kind: MigrationKind::Up,
    }]
}

pub fn chat() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create conversation and message tables",
        sql: include_str!("./migrations/000_create_chat.sql"),
        kind: MigrationKind::Up,
    }]
}
