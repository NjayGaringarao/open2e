import { Respondent } from "@/types/models";
import Database from "@tauri-apps/plugin-sql";

// Utility to safely open DB
const openDB = () => Database.load("sqlite:main.db");

export const getAll = async (): Promise<{
  respondents?: Respondent[];
  error?: string;
}> => {
  let db: Database | null = null;
  try {
    db = await openDB();
    const result = await db.select<
      { respondent_id: string; name: string; note: string }[]
    >("SELECT respondent_id, name FROM respondent");
    return { respondents: result };
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const add = async (
  respondent_id: string,
  name: string,
  note: string
): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openDB();
    await db.execute(
      "INSERT INTO respondent (respondent_id, name, note) VALUES ($1, $2, $3)",
      [respondent_id, name, note]
    );
    return {};
  } catch (error) {
    if (
      error ===
      "error returned from database: (code: 1555) UNIQUE constraint failed: respondent.respondent_id"
    ) {
      return {
        error: `❌ ERROR: ${respondent_id} already exist in the database. Please use another ID.`,
      };
    } else {
      return { error: `${error}` };
    }
  } finally {
    db?.close();
  }
};

export const update = async (
  respondent_id: string,
  prop: "name" | "note",
  newValue: string
): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openDB();
    await db.execute(
      `UPDATE respondent SET ${prop} = $1 WHERE respondent_id = $2`,
      [newValue, respondent_id]
    );
    return {};
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const remove = async (
  respondent_id: string
): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openDB();
    await db.execute("DELETE FROM respondent WHERE respondent_id = $1", [
      respondent_id,
    ]);
    return {};
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};
