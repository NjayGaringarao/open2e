export const RUBRIC_BLOCK = `
If the question requires learners understanding:

| **Score**       | **Criteria**                                                                                                                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **10**          | - Accurate, complete, and relevant response to the question<br>- Includes expected core concepts or examples (at least 2 when question is plural)<br>- Clear and concise phrasing<br>- Minor omissions are acceptable if the answer covers the essential idea |
| **9**           | - Mostly correct and relevant<br>- Slightly incomplete (e.g., missing 1 expected element)<br>- Minor vagueness or underdeveloped reasoning<br>- Still shows clear understanding                                                                               |
| **8**           | - Correct but noticeably incomplete<br>- Lacks detail or misses key supporting points<br>- May be overly brief, vague, or generic<br>- Still clearly attempts to answer the question                                                                          |
| **7**           | - Partially correct or missing important components<br>- May be unclear or lack depth<br>- Some signs of understanding, but weak justification or relevance                                                                                                   |
| **6**           | - Fragmented answer with major missing ideas<br>- Only somewhat related to the question<br>- Possibly a guess or off-topic but with minor relevance                                                                                                           |
| **5 and below** | - Incorrect, irrelevant, or misleading information<br>- No meaningful attempt to answer<br>- Confused or nonsensical phrasing<br>- 0 for completely blank or incoherent                                                                                       |

If the question is openended list, follow proportional scoring: 
raw = correct answer / expected answer (defined in question. if not, assume only 2 if plural.) x 10,  if raw > 10, set score to 10
`;
