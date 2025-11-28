import { openDatabase } from "./sqlite";
import Database from "@tauri-apps/plugin-sql";
import { AIDetectionData, AIDetectionResult } from "@/types/aiDetection";

export const insertAIDetection = async (
  data: AIDetectionData
): Promise<{ id?: number; error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();

    await db.execute(
      `INSERT INTO ai_detection (overall_score, sentence_scores, tokens, token_probs)
       VALUES ($1, $2, $3, $4)`,
      [
        data.overall_score,
        JSON.stringify(data.sentence_scores),
        JSON.stringify(data.tokens),
        JSON.stringify(data.token_probs),
      ]
    );

    // Get last inserted ID
    const lastIdRow = await db.select<{ id: number }[]>(
      `SELECT last_insert_rowid() as id`
    );
    const id = lastIdRow[0].id;

    return { id };
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const getAIDetectionById = async (
  id: number
): Promise<{ data?: AIDetectionResult; error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();

    const rows = await db.select<
      Array<{
        id: number;
        overall_score: number;
        sentence_scores: string;
        tokens: string;
        token_probs: string;
      }>
    >(`SELECT * FROM ai_detection WHERE id = $1`, [id]);

    if (rows.length === 0) {
      return { error: "AI detection record not found" };
    }

    const row = rows[0];
    const data: AIDetectionResult = {
      id: row.id,
      overall_score: row.overall_score,
      sentence_scores: JSON.parse(row.sentence_scores),
      tokens: JSON.parse(row.tokens),
      token_probs: JSON.parse(row.token_probs),
      message: "", // Will be generated on frontend
    };

    return { data };
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};
