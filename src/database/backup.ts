import { openDatabase } from "./sqlite";
import Database from "@tauri-apps/plugin-sql";

export interface BackupData {
  questions: Array<{
    id: number;
    content: string;
  }>;
  evaluations: Array<{
    id: number;
    question_id: number;
    rubric_id: number;
    answer: string;
    score: number;
    justification: string;
    detected_ai: number | null;
    llm_model: string;
    created_at: string;
  }>;
  rubrics: Array<{
    id: number;
    name: string;
    content: string;
    total_score: number;
    created_by: string;
    is_archived: boolean;
    created_at: string;
    archived_at: string | null;
  }>;
  conversations: Array<{
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
  }>;
  messages: Array<{
    id: string;
    conversation_id: string;
    role: string;
    content: string;
    status: string;
    created_at: string;
    updated_at: string;
  }>;
  metadata: {
    version: string;
    created_at: string;
    app_version?: string;
  };
}

export const exportAllData = async (): Promise<{
  data?: BackupData;
  error?: string;
}> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();

    // Query all tables
    const questions = await db.select<BackupData["questions"]>(
      "SELECT * FROM question ORDER BY id"
    );

    const evaluations = await db.select<BackupData["evaluations"]>(
      "SELECT * FROM evaluation ORDER BY id"
    );

    const rubrics = await db.select<BackupData["rubrics"]>(
      "SELECT * FROM rubric ORDER BY id"
    );

    const conversations = await db.select<BackupData["conversations"]>(
      "SELECT * FROM conversation ORDER BY created_at"
    );

    const messages = await db.select<BackupData["messages"]>(
      "SELECT * FROM message ORDER BY created_at"
    );

    const backupData: BackupData = {
      questions,
      evaluations,
      rubrics,
      conversations,
      messages,
      metadata: {
        version: "1.0",
        created_at: new Date().toISOString(),
        app_version: "open2e",
      },
    };

    return { data: backupData };
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};

export const validateBackupData = (
  data: any
): {
  isValid: boolean;
  error?: string;
} => {
  try {
    // Check if data is an object
    if (!data || typeof data !== "object") {
      return {
        isValid: false,
        error: "Backup file must contain a valid JSON object",
      };
    }

    // Check required top-level keys
    const requiredKeys = [
      "questions",
      "evaluations",
      "rubrics",
      "conversations",
      "messages",
      "metadata",
    ];
    for (const key of requiredKeys) {
      if (!(key in data)) {
        return { isValid: false, error: `Missing required field: ${key}` };
      }
    }

    // Check that arrays are actually arrays
    const arrayKeys = [
      "questions",
      "evaluations",
      "rubrics",
      "conversations",
      "messages",
    ];
    for (const key of arrayKeys) {
      if (!Array.isArray(data[key])) {
        return { isValid: false, error: `Field '${key}' must be an array` };
      }
    }

    // Basic validation for metadata
    if (!data.metadata.version || !data.metadata.created_at) {
      return { isValid: false, error: "Invalid metadata structure" };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: `Validation error: ${error}` };
  }
};

export const importAllData = async (
  data: BackupData
): Promise<{
  error?: string;
}> => {
  let db: Database | null = null;
  try {
    db = await openDatabase();

    // Validate the backup data
    const validation = validateBackupData(data);
    if (!validation.isValid) {
      return { error: validation.error };
    }

    // Start transaction
    await db.execute("BEGIN TRANSACTION");

    try {
      // Clear existing data in correct order (child tables first to respect foreign keys)
      await db.execute("DELETE FROM message");
      await db.execute("DELETE FROM conversation");
      await db.execute("DELETE FROM evaluation");
      await db.execute("DELETE FROM question");
      await db.execute("DELETE FROM rubric");

      // Insert data in correct order (parent tables first)

      // Insert rubrics
      for (const rubric of data.rubrics) {
        await db.execute(
          `INSERT INTO rubric (id, name, content, total_score, created_by, is_archived, created_at, archived_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            rubric.id,
            rubric.name,
            rubric.content,
            rubric.total_score,
            rubric.created_by,
            rubric.is_archived,
            rubric.created_at,
            rubric.archived_at,
          ]
        );
      }

      // Insert questions
      for (const question of data.questions) {
        await db.execute(`INSERT INTO question (id, content) VALUES ($1, $2)`, [
          question.id,
          question.content,
        ]);
      }

      // Insert conversations
      for (const conversation of data.conversations) {
        await db.execute(
          `INSERT INTO conversation (id, title, created_at, updated_at) VALUES ($1, $2, $3, $4)`,
          [
            conversation.id,
            conversation.title,
            conversation.created_at,
            conversation.updated_at,
          ]
        );
      }

      // Insert evaluations
      for (const evaluation of data.evaluations) {
        await db.execute(
          `INSERT INTO evaluation (id, question_id, rubric_id, answer, score, justification, detected_ai, llm_model, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            evaluation.id,
            evaluation.question_id,
            evaluation.rubric_id,
            evaluation.answer,
            evaluation.score,
            evaluation.justification,
            evaluation.detected_ai,
            evaluation.llm_model,
            evaluation.created_at,
          ]
        );
      }

      // Insert messages
      for (const message of data.messages) {
        await db.execute(
          `INSERT INTO message (id, conversation_id, role, content, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            message.id,
            message.conversation_id,
            message.role,
            message.content,
            message.status,
            message.created_at,
            message.updated_at,
          ]
        );
      }

      // Commit transaction
      await db.execute("COMMIT");

      return {};
    } catch (error) {
      // Rollback transaction on error
      await db.execute("ROLLBACK");
      throw error;
    }
  } catch (error) {
    return { error: `${error}` };
  } finally {
    db?.close();
  }
};
