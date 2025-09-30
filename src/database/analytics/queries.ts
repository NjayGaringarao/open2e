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
    "SELECT AVG(CAST(score AS FLOAT) / CAST(total_score AS FLOAT) * 100) as average FROM evaluation"
  );
  const overallAverageScore = overallAverageResult[0]?.average || 0;

  // Get average score per question (as percentage of total_score)
  const questionScoresResult = await db.select<QuestionScore[]>(`
    SELECT 
      q.id as questionId,
      q.content as questionContent,
      AVG(CAST(e.score AS FLOAT) / CAST(e.total_score AS FLOAT) * 100) as averageScore,
      COUNT(e.id) as totalEvaluations
    FROM question q
    LEFT JOIN evaluation e ON q.id = e.question_id
    GROUP BY q.id, q.content
    ORDER BY q.id
  `);

  // Get evaluations over time (grouped by date)
  const evaluationsOverTimeResult = await db.select<EvaluationTimeData[]>(`
    SELECT 
      DATE(timestamp) as date,
      COUNT(*) as count,
      AVG(CAST(score AS FLOAT) / CAST(total_score AS FLOAT) * 100) as averageScore
    FROM evaluation
    GROUP BY DATE(timestamp)
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
      e.rubric,
      e.total_score as totalScore,
      e.justification,
      e.llm_model as llmModel,
      e.timestamp
    FROM evaluation e
    JOIN question q ON e.question_id = q.id
    ORDER BY e.timestamp DESC
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
      e.rubric,
      e.total_score as totalScore,
      e.justification,
      e.llm_model as llmModel,
      e.timestamp
    FROM evaluation e
    JOIN question q ON e.question_id = q.id
    WHERE DATE(e.timestamp) BETWEEN ? AND ?
    ORDER BY e.timestamp DESC
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
      e.rubric,
      e.total_score as totalScore,
      e.justification,
      e.llm_model as llmModel,
      e.timestamp
    FROM evaluation e
    JOIN question q ON e.question_id = q.id
    WHERE e.question_id = ?
    ORDER BY e.timestamp DESC
  `,
    [questionId]
  );

  return result;
}
