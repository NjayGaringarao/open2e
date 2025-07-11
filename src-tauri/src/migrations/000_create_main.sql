-- Create respondent table
CREATE TABLE IF NOT EXISTS respondent (
  respondent_id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  note TEXT
);

-- Create question table
CREATE TABLE IF NOT EXISTS question (
  question_id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL
);

-- Create evaluation table
CREATE TABLE IF NOT EXISTS evaluation (
  evaluation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  respondent_id TEXT NOT NULL,
  answer TEXT NOT NULL,
  score INTEGER NOT NULL,
  justification TEXT,
  timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE,
  FOREIGN KEY (respondent_id) REFERENCES respondent(respondent_id) ON DELETE CASCADE
);
