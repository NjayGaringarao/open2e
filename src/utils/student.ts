import { Student } from "@/types/models";
import Database from "@tauri-apps/plugin-sql";

// Utility to safely open DB
const openDB = () => Database.load("sqlite:main.db");

export const getAll = async (): Promise<{
  students?: Student[];
  error?: string;
}> => {
  let db: Database | null = null;
  try {
    db = await openDB();
    const result = await db.select<
      { id: string; name: string; note: string }[]
    >("SELECT id, name, note FROM student");
    return { students: result };
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const add = async (
  id: string,
  name: string,
  note: string
): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openDB();
    await db.execute(
      "INSERT INTO student (id, name, note) VALUES ($1, $2, $3)",
      [id, name, note]
    );
    return {};
  } catch (error) {
    if (
      error ===
      "error returned from database: (code: 1555) UNIQUE constraint failed: student.id"
    ) {
      return {
        error: `❌ ERROR: ${id} already exist in the database. Please use another ID.`,
      };
    } else {
      return { error: `${error}` };
    }
  } finally {
    db?.close();
  }
};

export const update = async (
  id: string,
  prop: "name" | "note",
  newValue: string
): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openDB();
    await db.execute(`UPDATE student SET ${prop} = $1 WHERE id = $2`, [
      newValue,
      id,
    ]);
    return {};
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const remove = async (id: string): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openDB();
    await db.execute("DELETE FROM student WHERE id = $1", [id]);
    return {};
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};
