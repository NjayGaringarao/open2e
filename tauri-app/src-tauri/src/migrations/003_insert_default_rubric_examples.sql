-- Insert default rubric examples for rubric id=1 (Default Rubric)
-- Examples are calculated with totalScore = 10
-- excellentScore = 9 (90% of 10), goodScore = 8 (80% of 10), poorScore = 4 (40% of 10), zeroScore = 0

-- Example 1
INSERT INTO rubric_example (rubric_id, user_content, assistant_content, display_order) VALUES (
  1,
  'QUESTION: How do I know if my PC is compatible with Windows 11? 
ANSWER: If the PC has a processor of Intel Core series 8th generation. Or an AMD equivalent, a TPM 2.0 and 8GB of RAM. It is compatible.',
  '{"result":{"score":9,"justification":"- Correctly identifies key requirements: processor type, TPM 2.0, and RAM.\n- Shows clear understanding of the topic relevant to the question.\n- While some requirements (like storage or graphics) are missing, the answer is sufficient for basic literacy."},"suggested_query":"hardware requirements for Windows 11 compatibility check","error":null}',
  1
);

-- Example 2
INSERT INTO rubric_example (rubric_id, user_content, assistant_content, display_order) VALUES (
  1,
  'QUESTION: What is phishing?
ANSWER: It''s when you eat fish during work time.',
  '{"result":{"score":0,"justification":"- The answer is completely unrelated and nonsensical.\n- Shows no understanding of the topic.\n- Contains fabricated or joking content."},"suggested_query":"what is phishing in computer security for beginners","error":null}',
  2
);

-- Example 3
INSERT INTO rubric_example (rubric_id, user_content, assistant_content, display_order) VALUES (
  1,
  'QUESTION: What is the role of a system administrator?
ANSWER: To manage the computers and make sure they work.',
  '{"result":{"score":8,"justification":"- Shows basic understanding of the system administrator''s responsibility.\n- Lacks specific details like user management, network configuration, or security.\n- Still relevant and valid for a basic answer."},"suggested_query":"roles and responsibilities of a system administrator","error":null}',
  3
);

-- Example 4
INSERT INTO rubric_example (rubric_id, user_content, assistant_content, display_order) VALUES (
  1,
  'QUESTION: Give examples of 5 input devices.
ANSWER: The mouse, keyboard, Windows 10, MS Word, music',
  '{"result":{"score":4,"justification":"- Mentions 5 input devices: mouse and keyboard.\n- The question requires 5 valid input devices but only the mouse and keyboard are valid\n- Applying proportional scoring: 2/5 x total score."},"suggested_query":"list of common input devices in computer basics","error":null}',
  5
);

-- Example 5
INSERT INTO rubric_example (rubric_id, user_content, assistant_content, display_order) VALUES (
  1,
  'QUESTION: What is Microsoft Word used for?
ANSWER: To make documents.',
  '{"result":{"score":7,"justification":"- Answer is correct but overly vague.\n- Could mention editing, formatting, or printing text-based documents.\n- A bit too short to reflect full understanding."},"suggested_query":"common uses of Microsoft Word","error":null}',
  7
);

