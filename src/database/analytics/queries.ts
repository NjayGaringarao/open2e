import { openLearnerDatabase } from "../sqlite";
import type { 
  AnalyticsSummary, 
  QuestionScore, 
  EvaluationTimeData, 
  EvaluationData 
} from "./types";

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const db = await openLearnerDatabase();
  
  // Get total number of answers evaluated
  const totalAnswersResult = await db.select<[{ count: number }]>(
    "SELECT COUNT(*) as count FROM evaluation"
  );
  const totalAnswers = totalAnswersResult[0]?.count || 0;

  // Get overall average score
  const overallAverageResult = await db.select<[{ average: number }]>(
    "SELECT AVG(score) as average FROM evaluation"
  );
  const overallAverageScore = overallAverageResult[0]?.average || 0;

  // Get average score per question
  const questionScoresResult = await db.select<QuestionScore[]>(`
    SELECT 
      q.id as questionId,
      q.content as questionContent,
      AVG(e.score) as averageScore,
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
      AVG(score) as averageScore
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
  const db = await openLearnerDatabase();
  
  const result = await db.select<EvaluationData[]>(`
    SELECT 
      e.id,
      e.question_id as questionId,
      q.content as questionContent,
      e.answer,
      e.score,
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
  const db = await openLearnerDatabase();
  
  const result = await db.select<EvaluationData[]>(`
    SELECT 
      e.id,
      e.question_id as questionId,
      q.content as questionContent,
      e.answer,
      e.score,
      e.justification,
      e.llm_model as llmModel,
      e.timestamp
    FROM evaluation e
    JOIN question q ON e.question_id = q.id
    WHERE DATE(e.timestamp) BETWEEN ? AND ?
    ORDER BY e.timestamp DESC
  `, [startDate, endDate]);

  return result;
}

export async function getEvaluationsByQuestion(questionId: number): Promise<EvaluationData[]> {
  const db = await openLearnerDatabase();
  
  const result = await db.select<EvaluationData[]>(`
    SELECT 
      e.id,
      e.question_id as questionId,
      q.content as questionContent,
      e.answer,
      e.score,
      e.justification,
      e.llm_model as llmModel,
      e.timestamp
    FROM evaluation e
    JOIN question q ON e.question_id = q.id
    WHERE e.question_id = ?
    ORDER BY e.timestamp DESC
  `, [questionId]);

  return result;
}
