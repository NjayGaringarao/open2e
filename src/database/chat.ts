import { openLearnerDatabase } from "./sqlite";
import Database from "@tauri-apps/plugin-sql";
import type { Conversation, Message } from "@/models/index";

export const getAllConversations = async (): Promise<{
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

export const createConversation = async (
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

export const deleteConversation = async (
  id: string
): Promise<{ error?: string }> => {
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

export const addMessage = async (msg: Message): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openLearnerDatabase();
    await db.execute(`UPDATE conversation SET updated_at = $1 WHERE id = $2`, [
      msg.updated_at,
      msg.conversation_id,
    ]);
    await db.execute(
      `INSERT INTO message (id, conversation_id, role, content, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        msg.id,
        msg.conversation_id,
        msg.role,
        msg.content,
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

export const getMessagesByConversation = async (
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
