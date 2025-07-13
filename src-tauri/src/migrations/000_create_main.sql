-- Create tag table
CREATE TABLE IF NOT EXISTS tag (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL UNIQUE
);

-- Create student table
CREATE TABLE IF NOT EXISTS student (
  id TEXT PRIMARY KEY,
  tag_id INTEGER,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  remarks TEXT,
  FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE SET NULL
);

-- Create question table
CREATE TABLE IF NOT EXISTS question (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL
);

-- Create evaluation table
CREATE TABLE IF NOT EXISTS evaluation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  respondent_id TEXT NOT NULL,
  answer TEXT NOT NULL,
  score INTEGER NOT NULL,
  justification TEXT,
  timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE,
  FOREIGN KEY (respondent_id) REFERENCES student(id) ON DELETE CASCADE
);
