use tauri_plugin_sql::{Migration, MigrationKind};

pub fn evaluator() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "creates a table for evaluator mode.",
        sql: include_str!("./migrations/000_create_evaluator.sql"),
        kind: MigrationKind::Up,
    }]
}

pub fn learner() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "creates a table for learner mode.",
        sql: include_str!("./migrations/000_create_learner.sql"),
        kind: MigrationKind::Up,
    }]
}
