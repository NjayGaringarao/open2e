import { Student } from "@/types/models";
import { openMainDatabase } from "./sqlite";
import Database from "@tauri-apps/plugin-sql";

export const getAll = async (): Promise<{
  students?: Student[];
  error?: string;
}> => {
  let db: Database | null = null;
  try {
    db = await openMainDatabase();

    const result = await db.select<
      {
        id: string;
        first_name: string;
        middle_name?: string;
        last_name: string;
        remarks?: string;
        tag_id: number;
        tag_label: string | null;
      }[]
    >(`
  SELECT student.id,
         student.first_name,
         student.middle_name,
         student.last_name,
         student.remarks,
         tag.id AS tag_id,
         tag.label AS tag_label
  FROM student
  LEFT JOIN tag ON student.tag_id = tag.id
`);

    const students: Student[] = result.map((r) => ({
      id: r.id,
      first_name: r.first_name,
      middle_name: r.middle_name,
      last_name: r.last_name,
      remarks: r.remarks ?? undefined,
      tag:
        r.tag_id && r.tag_label
          ? { id: r.tag_id, label: r.tag_label }
          : undefined,
    }));

    return { students };
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

interface IAdd {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  remarks?: string;
  tag_id?: number;
}

export const add = async ({
  id,
  first_name,
  middle_name,
  last_name,
  remarks,
  tag_id,
}: IAdd): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openMainDatabase();
    await db.execute(
      `INSERT INTO student (id, first_name, middle_name, last_name, remarks, tag_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, first_name, middle_name, last_name, remarks, tag_id]
    );
    return {};
  } catch (error) {
    if (`${error}`.includes("UNIQUE constraint failed: student.id")) {
      return {
        error: `❌ ERROR: ID "${id}" already exists in the database.`,
      };
    } else {
      return { error: `${error}` };
    }
  } finally {
    db?.close();
  }
};

export const update = async (student: Student): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openMainDatabase();

    await db.execute(
      `UPDATE student
       SET first_name = $1,
           middle_name = $2,
           last_name = $3,
           remarks = $4,
           tag_id = $5
       WHERE id = $6`,
      [
        student.first_name,
        student.middle_name ?? "",
        student.last_name,
        student.remarks ?? "",
        student.tag?.id ?? null,
        student.id,
      ]
    );

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
    db = await openMainDatabase();
    await db.execute("DELETE FROM student WHERE id = $1", [id]);
    return {};
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};
