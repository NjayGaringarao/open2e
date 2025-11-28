import { Tag } from "@/models";
import Database from "@tauri-apps/plugin-sql";
import { openDatabase } from "./sqlite";

export const getAll = async (): Promise<{
  tags?: Tag[];
  error?: string;
}> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();

    const tags = await db.select<
      {
        id: number;
        label: string;
      }[]
    >(`
  SELECT id, label FROM tag
`);
    return { tags };
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const create = async (label: string): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();
    await db.execute(`INSERT INTO tag (label) VALUES (?)`, [label]);
    return {};
  } catch (error) {
    if (`${error}`.includes("UNIQUE constraint failed: tag.label")) {
      return {
        error: `❌ ERROR: Tag label: "${label}" already exists in the database.`,
      };
    } else {
      return { error: `${error}` };
    }
  } finally {
    db?.close();
  }
};

export const remove = async (id: number): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();
    await db.execute("DELETE FROM tag WHERE id = $1", [id]);
    return {};
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};
