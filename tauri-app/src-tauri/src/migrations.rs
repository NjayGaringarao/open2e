use tauri_plugin_sql::{Migration, MigrationKind};

pub fn main() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "creates the database schema.",
            sql: include_str!("./migrations/000_create_main.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "inserts default rubric.",
            sql: include_str!("./migrations/001_insert_default_rubric.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "creates rubric_example table.",
            sql: include_str!("./migrations/002_create_rubric_example.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "inserts default rubric examples.",
            sql: include_str!("./migrations/003_insert_default_rubric_examples.sql"),
            kind: MigrationKind::Up,
        },
    ]
}
