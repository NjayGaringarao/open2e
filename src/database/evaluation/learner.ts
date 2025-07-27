import { openLearnerDatabase } from "../sqlite";
import Database from "@tauri-apps/plugin-sql";

interface IAdd {
  question: string;
  answer: string;
  score: number;
  justification: string;
  llm_model: string;
}

// Utility function to normalize the question text
const normalizeQuestion = (q: string) =>
  q
    .replace(/[^\w\s]/g, "") // remove symbols
    .replace(/\s+/g, " ") // collapse spaces
    .trim()
    .toLowerCase();

export const add = async ({
  question,
  answer,
  score,
  justification,
  llm_model,
}: IAdd): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openLearnerDatabase();

    const normalized = normalizeQuestion(question);

    // Step 1: Check if question already exists (normalized)
    const existing = await db.select<{ id: number }[]>(
      `SELECT id FROM question WHERE REPLACE(LOWER(TRIM(content)), '[^\\w\\s]', '') = $1`,
      [normalized]
    );

    let question_id: number;

    if (existing.length > 0) {
      question_id = existing[0].id;
    } else {
      // Insert new question
      await db.execute(`INSERT INTO question (content) VALUES ($1)`, [
        question,
      ]);

      // Get last inserted ID
      const lastIdRow = await db.select<{ id: number }[]>(
        `SELECT last_insert_rowid() as id`
      );
      question_id = lastIdRow[0].id;
    }

    // Step 2: Insert into evaluation
    await db.execute(
      `INSERT INTO evaluation (question_id, answer, score, justification, llm_model)
       VALUES ($1, $2, $3, $4, $5)`,
      [question_id, answer, score, justification, llm_model]
    );

    return {};
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};
