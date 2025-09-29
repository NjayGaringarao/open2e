import { normalize } from "@/utils/string";
import { openDatabase } from "../sqlite";
import Database from "@tauri-apps/plugin-sql";

interface IAdd {
  question: string;
  answer: string;
  score: number;
  justification: string;
  llm_model: string;
  detected_ai?: number;
}

export const add = async ({
  question,
  answer,
  score,
  justification,
  llm_model,
  detected_ai,
}: IAdd): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();

    const normalized = normalize(question);

    // Step 1: Get all questions and normalize in JS
    const allQuestions = await db.select<{ id: number; content: string }[]>(
      `SELECT id, content FROM question`
    );

    const match = allQuestions.find((q) => normalize(q.content) === normalized);

    let question_id: number;

    if (match) {
      question_id = match.id;
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
      `INSERT INTO evaluation (question_id, answer, score, justification, llm_model, detected_ai)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [question_id, answer, score, justification, llm_model, detected_ai]
    );

    return {};
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};
