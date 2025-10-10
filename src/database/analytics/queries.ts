import { openDatabase } from "../sqlite";
import type {
  AnalyticsSummary,
  QuestionScore,
  EvaluationTimeData,
  EvaluationData,
} from "./types";

// Function to clear existing evaluation data
export async function clearExistingData(): Promise<{ error?: string }> {
  const db = await openDatabase();

  try {
    // Clear all existing evaluations
    await db.execute("DELETE FROM evaluation");

    // Clear all existing questions
    await db.execute("DELETE FROM question");

    return {};
  } catch (error) {
    return { error: `${error}` };
  }
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const db = await openDatabase();

  // Get total number of answers evaluated
  const totalAnswersResult = await db.select<[{ count: number }]>(
    "SELECT COUNT(*) as count FROM evaluation"
  );
  const totalAnswers = totalAnswersResult[0]?.count || 0;

  // Get overall average score (as percentage of total_score)
  const overallAverageResult = await db.select<[{ average: number }]>(
    "SELECT AVG(CAST(e.score AS FLOAT) / CAST(r.total_score AS FLOAT) * 100) as average FROM evaluation e JOIN rubric r ON e.rubric_id = r.id"
  );
  const overallAverageScore = overallAverageResult[0]?.average || 0;

  // Get average score per question (as percentage of total_score)
  const questionScoresResult = await db.select<QuestionScore[]>(`
    SELECT 
      q.id as questionId,
      q.content as questionContent,
      AVG(CAST(e.score AS FLOAT) / CAST(r.total_score AS FLOAT) * 100) as averageScore,
      COUNT(e.id) as totalEvaluations
    FROM question q
    LEFT JOIN evaluation e ON q.id = e.question_id
    LEFT JOIN rubric r ON e.rubric_id = r.id
    GROUP BY q.id, q.content
    ORDER BY q.id
  `);

  // Get evaluations over time (grouped by date)
  const evaluationsOverTimeResult = await db.select<EvaluationTimeData[]>(`
    SELECT 
      DATE(e.created_at) as date,
      COUNT(*) as count,
      AVG(CAST(e.score AS FLOAT) / CAST(r.total_score AS FLOAT) * 100) as averageScore
    FROM evaluation e
    JOIN rubric r ON e.rubric_id = r.id
    GROUP BY DATE(e.created_at)
    ORDER BY date
  `);

  return {
    totalAnswers,
    overallAverageScore,
    averageScorePerQuestion: questionScoresResult,
    evaluationsOverTime: evaluationsOverTimeResult,
  };
}

export async function getAllEvaluations(): Promise<EvaluationData[]> {
  const db = await openDatabase();

  const result = await db.select<EvaluationData[]>(`
    SELECT 
      e.id,
      e.question_id as questionId,
      q.content as questionContent,
      e.answer,
      e.score,
      e.rubric_id as rubricId,
      r.name as rubricName,
      r.content as rubricContent,
      r.total_score as totalScore,
      e.justification,
      e.llm_model as llmModel,
      e.created_at as timestamp
    FROM evaluation e
    JOIN question q ON e.question_id = q.id
    JOIN rubric r ON e.rubric_id = r.id
    ORDER BY e.created_at DESC
  `);

  return result;
}

export async function getEvaluationsByDateRange(
  startDate: string,
  endDate: string
): Promise<EvaluationData[]> {
  const db = await openDatabase();

  const result = await db.select<EvaluationData[]>(
    `
    SELECT 
      e.id,
      e.question_id as questionId,
      q.content as questionContent,
      e.answer,
      e.score,
      e.rubric_id as rubricId,
      r.name as rubricName,
      r.content as rubricContent,
      r.total_score as totalScore,
      e.justification,
      e.llm_model as llmModel,
      e.created_at as timestamp
    FROM evaluation e
    JOIN question q ON e.question_id = q.id
    JOIN rubric r ON e.rubric_id = r.id
    WHERE DATE(e.created_at) BETWEEN ? AND ?
    ORDER BY e.created_at DESC
  `,
    [startDate, endDate]
  );

  return result;
}

export async function getEvaluationsByQuestion(
  questionId: number
): Promise<EvaluationData[]> {
  const db = await openDatabase();

  const result = await db.select<EvaluationData[]>(
    `
    SELECT 
      e.id,
      e.question_id as questionId,
      q.content as questionContent,
      e.answer,
      e.score,
      e.rubric_id as rubricId,
      r.name as rubricName,
      r.content as rubricContent,
      r.total_score as totalScore,
      e.justification,
      e.llm_model as llmModel,
      e.created_at as timestamp
    FROM evaluation e
    JOIN question q ON e.question_id = q.id
    JOIN rubric r ON e.rubric_id = r.id
    WHERE e.question_id = ?
    ORDER BY e.created_at DESC
  `,
    [questionId]
  );

  return result;
}
