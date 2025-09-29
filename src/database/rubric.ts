import { openDatabase } from "./sqlite";
import Database from "@tauri-apps/plugin-sql";

export interface Rubric {
  id: number;
  name: string;
  content: string;
  created_at: string;
  is_default?: boolean;
}

interface ICreateRubric {
  name: string;
  content: string;
}

export const getAllRubrics = async (): Promise<{
  rubrics: Rubric[];
  error?: string;
}> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();

    const rubrics = await db.select<Rubric[]>(
      `SELECT id, name, content, created_at FROM rubric ORDER BY created_at ASC`
    );

    return { rubrics };
  } catch (error) {
    return { rubrics: [], error: `${error}` };
  } finally {
    db?.close();
  }
};

export const createRubric = async ({
  name,
  content,
}: ICreateRubric): Promise<{ rubric?: Rubric; error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();

    await db.execute(`INSERT INTO rubric (name, content) VALUES ($1, $2)`, [
      name,
      content,
    ]);

    // Get the created rubric
    const lastIdRow = await db.select<{ id: number }[]>(
      `SELECT last_insert_rowid() as id`
    );
    const rubricId = lastIdRow[0].id;

    const rubric = await db.select<Rubric[]>(
      `SELECT id, name, content, created_at FROM rubric WHERE id = $1`,
      [rubricId]
    );

    return { rubric: rubric[0] };
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const deleteRubric = async (id: number): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();

    await db.execute(`DELETE FROM rubric WHERE id = $1`, [id]);

    return {};
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const getRubricById = async (
  id: number
): Promise<{ rubric?: Rubric; error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();

    const rubric = await db.select<Rubric[]>(
      `SELECT id, name, content, created_at FROM rubric WHERE id = $1`,
      [id]
    );

    if (rubric.length === 0) {
      return { error: "Rubric not found" };
    }

    return { rubric: rubric[0] };
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};
