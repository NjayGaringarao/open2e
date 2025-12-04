import { openDatabase } from "./sqlite";
import Database from "@tauri-apps/plugin-sql";
import { EvaluationExample } from "@/lib/context/evaluation/examples";

export interface RubricExample {
  id: number;
  rubric_id: number;
  user_content: string;
  assistant_content: string;
  display_order: number;
  created_at: string;
}

interface ICreateRubricExample {
  rubric_id: number;
  user_content: string;
  assistant_content: string;
  display_order?: number;
}

interface IUpdateRubricExample {
  id: number;
  user_content?: string;
  assistant_content?: string;
  display_order?: number;
}

export const getRubricExamples = async (
  rubricId: number
): Promise<{
  examples: EvaluationExample[];
  error?: string;
}> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();

    const examples = await db.select<RubricExample[]>(
      `SELECT id, rubric_id, user_content, assistant_content, display_order, created_at 
       FROM rubric_example 
       WHERE rubric_id = $1 
       ORDER BY display_order ASC, id ASC`,
      [rubricId]
    );

    // Convert database format to EvaluationExample format
    const evaluationExamples: EvaluationExample[] = [];
    for (const example of examples) {
      evaluationExamples.push({
        role: "user",
        content: example.user_content,
      });
      evaluationExamples.push({
        role: "assistant",
        content: example.assistant_content,
      });
    }

    return { examples: evaluationExamples };
  } catch (error) {
    return { examples: [], error: `${error}` };
  } finally {
    db?.close();
  }
};

export const getRubricExamplesWithIds = async (
  rubricId: number
): Promise<{
  examples: RubricExample[];
  error?: string;
}> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();

    const examples = await db.select<RubricExample[]>(
      `SELECT id, rubric_id, user_content, assistant_content, display_order, created_at 
       FROM rubric_example 
       WHERE rubric_id = $1 
       ORDER BY display_order ASC, id ASC`,
      [rubricId]
    );

    return { examples };
  } catch (error) {
    return { examples: [], error: `${error}` };
  } finally {
    db?.close();
  }
};

export const createRubricExample = async ({
  rubric_id,
  user_content,
  assistant_content,
  display_order = 0,
}: ICreateRubricExample): Promise<{
  example?: RubricExample;
  error?: string;
}> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();

    await db.execute(
      `INSERT INTO rubric_example (rubric_id, user_content, assistant_content, display_order) 
       VALUES ($1, $2, $3, $4)`,
      [rubric_id, user_content, assistant_content, display_order]
    );

    // Get the created example
    const lastIdRow = await db.select<{ id: number }[]>(
      `SELECT last_insert_rowid() as id`
    );
    const exampleId = lastIdRow[0].id;

    const example = await db.select<RubricExample[]>(
      `SELECT id, rubric_id, user_content, assistant_content, display_order, created_at 
       FROM rubric_example 
       WHERE id = $1`,
      [exampleId]
    );

    return { example: example[0] };
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const updateRubricExample = async ({
  id,
  user_content,
  assistant_content,
  display_order,
}: IUpdateRubricExample): Promise<{
  example?: RubricExample;
  error?: string;
}> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();

    // Build dynamic update query based on provided fields
    const updates: string[] = [];
    const values: any[] = [];

    if (user_content !== undefined) {
      updates.push("user_content = $" + (values.length + 1));
      values.push(user_content);
    }
    if (assistant_content !== undefined) {
      updates.push("assistant_content = $" + (values.length + 1));
      values.push(assistant_content);
    }
    if (display_order !== undefined) {
      updates.push("display_order = $" + (values.length + 1));
      values.push(display_order);
    }

    if (updates.length === 0) {
      return { error: "No fields to update" };
    }

    values.push(id);

    await db.execute(
      `UPDATE rubric_example 
       SET ${updates.join(", ")} 
       WHERE id = $${values.length}`,
      values
    );

    const example = await db.select<RubricExample[]>(
      `SELECT id, rubric_id, user_content, assistant_content, display_order, created_at 
       FROM rubric_example 
       WHERE id = $1`,
      [id]
    );

    if (example.length === 0) {
      return { error: "Example not found" };
    }

    return { example: example[0] };
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const deleteRubricExample = async (
  id: number
): Promise<{ error?: string }> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();

    await db.execute(`DELETE FROM rubric_example WHERE id = $1`, [id]);

    return {};
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

