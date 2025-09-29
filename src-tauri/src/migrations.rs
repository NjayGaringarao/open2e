use tauri_plugin_sql::{Migration, MigrationKind};

pub fn main() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "creates the database schema.",
        sql: include_str!("./migrations/000_create_main.sql"),
        kind: MigrationKind::Up,
    }]
}
