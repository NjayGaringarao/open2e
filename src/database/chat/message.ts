import { Message } from "@/models";
import Database from "@tauri-apps/plugin-sql";
import { openLearnerDatabase } from "../sqlite";

export const getAllByConversation = async (
  conversation_id: string
): Promise<{ messages?: Message[]; error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openLearnerDatabase();
    const messages = await db.select<Message[]>(
      `
      SELECT * FROM message
      WHERE conversation_id = $1
      ORDER BY created_at ASC
    `,
      [conversation_id]
    );
    return { messages };
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const add = async (msg: Message): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openLearnerDatabase();
    await db.execute(`UPDATE conversation SET updated_at = $1 WHERE id = $2`, [
      msg.updated_at,
      msg.conversation_id,
    ]);
    await db.execute(
      `INSERT INTO message (id, conversation_id, role, content, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        msg.id,
        msg.conversation_id,
        msg.role,
        msg.content,
        msg.status,
        msg.created_at,
        msg.updated_at,
      ]
    );
    return {};
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const update = async (msg: Message): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openLearnerDatabase();
    await db.execute(`UPDATE conversation SET updated_at = $1 WHERE id = $2`, [
      msg.updated_at,
      msg.conversation_id,
    ]);
    await db.execute(
      `UPDATE message SET role = ?, content = ?, status = ?, created_at = ?, updated_at = ? WHERE id = ?`,
      [
        msg.role,
        msg.content,
        msg.status,
        msg.created_at,
        msg.updated_at,
        msg.id,
      ]
    );

    return {};
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};
