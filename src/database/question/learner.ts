import { openLearnerDatabase } from "../sqlite";
import { Question } from "@/models";
import Database from "@tauri-apps/plugin-sql";
import { normalize } from "@/utils/string";

export const getTopQuestions = async (): Promise<{
  questions: Question[];
  error?: string;
}> => {
  let db: Database | null = null;
  try {
    db = await openLearnerDatabase();

    const rows = await db.select<{ id: number; content: string }[]>(
      `
      SELECT q.id, q.content
      FROM question q
      JOIN evaluation e ON q.id = e.question_id
      GROUP BY q.id
      ORDER BY COUNT(e.id) DESC
      LIMIT 3
      `
    );

    return { questions: rows.slice(0, 3) };
  } catch (error) {
    return { questions: [], error: `${error}` };
  } finally {
    db?.close();
  }
};

export const getSimilarQuestions = async (
  question: string
): Promise<{ questions: Question[]; error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openLearnerDatabase();
    const normalized = normalize(question);

    const rows = await db.select<{ id: number; content: string }[]>(
      `
      SELECT id, content FROM question
      WHERE LOWER(content) LIKE $1
      LIMIT 3
      `,
      [`%${normalized}%`]
    );

    return { questions: rows.slice(0, 3) };
  } catch (error) {
    return { questions: [], error: `${error}` };
  } finally {
    db?.close();
  }
};
