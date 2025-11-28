-- Create CONVERSATION table
CREATE TABLE IF NOT EXISTS conversation (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create MESSAGE table
CREATE TABLE IF NOT EXISTS message (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversation(id) ON DELETE CASCADE
);

-- Create question table
CREATE TABLE IF NOT EXISTS question (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL
);

-- Create rubric table
CREATE TABLE IF NOT EXISTS rubric (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 10,
  created_by TEXT NOT NULL DEFAULT 'USER',
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  archived_at TEXT
);

-- Create ai_detection table
CREATE TABLE IF NOT EXISTS ai_detection (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  overall_score REAL NOT NULL,
  sentence_scores TEXT NOT NULL,  -- JSON array
  tokens TEXT NOT NULL,            -- JSON array
  token_probs TEXT NOT NULL        -- JSON array
);

-- Create evaluation table
CREATE TABLE IF NOT EXISTS evaluation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  rubric_id INTEGER NOT NULL,
  answer TEXT NOT NULL,
  score INTEGER NOT NULL,
  justification TEXT NOT NULL,
  ai_detection_id INTEGER,
  llm_model TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE RESTRICT,
  FOREIGN KEY (rubric_id) REFERENCES rubric(id) ON DELETE RESTRICT,
  FOREIGN KEY (ai_detection_id) REFERENCES ai_detection(id) ON DELETE SET NULL
)