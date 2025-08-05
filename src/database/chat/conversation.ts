import { Conversation } from "@/models";
import Database from "@tauri-apps/plugin-sql";
import { openLearnerDatabase } from "../sqlite";

export const getAll = async (): Promise<{
  conversations?: Conversation[];
  error?: string;
}> => {
  let db: Database | null = null;
  try {
    db = await openLearnerDatabase();
    const rows = await db.select<Conversation[]>(`
      SELECT * FROM conversation ORDER BY updated_at DESC
    `);
    return { conversations: rows };
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const create = async (
  title: string,
  id: string,
  now: string
): Promise<{ conversation?: Conversation; error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openLearnerDatabase();
    await db.execute(
      `INSERT INTO conversation (id, title, created_at, updated_at)
       VALUES ($1, $2, $3, $4)`,
      [id, title, now, now]
    );
    return { conversation: { id, title, created_at: now, updated_at: now } };
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const remove = async (id: string): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openLearnerDatabase();
    await db.execute(`DELETE FROM conversation WHERE id = $1`, [id]);
    return {};
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const update = async (
  convo: Conversation
): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openLearnerDatabase();

    await db.execute(
      `UPDATE conversation SET title = ?, updated_at = ? WHERE id = ?`,
      [convo.title, convo.updated_at, convo.id]
    );

    return {};
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};
