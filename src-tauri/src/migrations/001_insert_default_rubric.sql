-- Insert default rubric
INSERT INTO rubric (name, content, total_score) VALUES (
  'Default Rubric',
  'If the question requires learners understanding:

10 - Accurate, complete, and relevant response to the question. Includes expected core concepts or examples (at least 2 when question is plural). Clear and concise phrasing. Minor omissions are acceptable if the answer covers the essential idea.
9 - Mostly correct and relevant. Slightly incomplete (e.g., missing 1 expected element). Minor vagueness or underdeveloped reasoning. Still shows clear understanding.
8 - Correct but noticeably incomplete. Lacks detail or misses key supporting points. May be overly brief, vague, or generic. Still clearly attempts to answer the question.
7 - Partially correct or missing important components. May be unclear or lack depth. Some signs of understanding, but weak justification or relevance.
6 - Fragmented answer with major missing ideas. Only somewhat related to the question. Possibly a guess or off-topic but with minor relevance.
5 and below - Incorrect, irrelevant, or misleading information. No meaningful attempt to answer. Confused or nonsensical phrasing. 0 for completely blank or incoherent.

If the question is openended list, follow proportional scoring: 
raw = correct answer / expected answer (defined in question. if not, assume only 2 if plural.) x 10,  if raw > 10, set score to 10',
  10
);
