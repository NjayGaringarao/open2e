-- Create rubric_example table
CREATE TABLE IF NOT EXISTS rubric_example (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rubric_id INTEGER NOT NULL,
  user_content TEXT NOT NULL,
  assistant_content TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rubric_id) REFERENCES rubric(id) ON DELETE CASCADE
);

-- Create index for faster lookups by rubric_id
CREATE INDEX IF NOT EXISTS idx_rubric_example_rubric_id ON rubric_example(rubric_id);

