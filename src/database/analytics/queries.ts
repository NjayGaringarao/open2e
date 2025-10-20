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

  // Get AI Detection metrics
  const aiDetectionResult = await db.select<
    [
      {
        totalWithAIDetection: number;
        averageAIScore: number;
        highRiskCount: number;
        mediumRiskCount: number;
        lowRiskCount: number;
      }
    ]
  >(`
    SELECT 
      COUNT(*) as totalWithAIDetection,
      AVG(ad.overall_score) as averageAIScore,
      SUM(CASE WHEN ad.overall_score >= 0.85 THEN 1 ELSE 0 END) as highRiskCount,
      SUM(CASE WHEN ad.overall_score >= 0.60 AND ad.overall_score < 0.85 THEN 1 ELSE 0 END) as mediumRiskCount,
      SUM(CASE WHEN ad.overall_score < 0.60 THEN 1 ELSE 0 END) as lowRiskCount
    FROM evaluation e
    LEFT JOIN ai_detection ad ON e.ai_detection_id = ad.id
    WHERE ad.id IS NOT NULL
  `);

  // Debug logging for AI Detection query
  console.log("AI Detection Query Result:", aiDetectionResult);
  console.log("First result:", aiDetectionResult[0]);
  console.log("Result length:", aiDetectionResult.length);

  const aiMetrics = aiDetectionResult[0] || {
    totalWithAIDetection: 0,
    averageAIScore: 0,
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: 0,
  };

  console.log("Processed AI Metrics:", aiMetrics);

  const aiDetectionRate =
    totalAnswers > 0
      ? (aiMetrics.totalWithAIDetection / totalAnswers) * 100
      : 0;

  const finalResult = {
    totalAnswers,
    overallAverageScore,
    averageScorePerQuestion: questionScoresResult,
    evaluationsOverTime: evaluationsOverTimeResult,
    aiDetectionMetrics: {
      totalWithAIDetection: aiMetrics.totalWithAIDetection,
      averageAIScore: aiMetrics.averageAIScore || 0,
      highRiskCount: aiMetrics.highRiskCount,
      mediumRiskCount: aiMetrics.mediumRiskCount,
      lowRiskCount: aiMetrics.lowRiskCount,
      aiDetectionRate: aiDetectionRate,
    },
  };

  console.log("Final Analytics Summary Result:", finalResult);
  console.log(
    "AI Detection Metrics in Final Result:",
    finalResult.aiDetectionMetrics
  );

  return finalResult;
}

export async function getAllEvaluations(): Promise<EvaluationData[]> {
  const db = await openDatabase();

  const result = await db.select<any[]>(`
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
      e.created_at as timestamp,
      e.ai_detection_id as aiDetectionId,
      ad.overall_score,
      ad.sentence_scores,
      ad.tokens,
      ad.token_probs
    FROM evaluation e
    JOIN question q ON e.question_id = q.id
    JOIN rubric r ON e.rubric_id = r.id
    LEFT JOIN ai_detection ad ON e.ai_detection_id = ad.id
    ORDER BY e.created_at DESC
  `);

  // Transform the result to include properly structured AI detection data
  return result.map((row) => ({
    id: row.id,
    questionId: row.questionId,
    questionContent: row.questionContent,
    answer: row.answer,
    score: row.score,
    rubricId: row.rubricId,
    rubricName: row.rubricName,
    rubricContent: row.rubricContent,
    totalScore: row.totalScore,
    justification: row.justification,
    llmModel: row.llmModel,
    timestamp: row.timestamp,
    aiDetectionId: row.aiDetectionId,
    aiDetectionData: row.aiDetectionId
      ? {
          overall_score: row.overall_score,
          sentence_scores: JSON.parse(row.sentence_scores || "[]"),
          tokens: JSON.parse(row.tokens || "[]"),
          token_probs: JSON.parse(row.token_probs || "[]"),
          message: `We are ${Math.round(
            (row.overall_score || 0) * 100
          )}% certain that the answer is AI generated.`,
        }
      : null,
  }));
}

export async function getEvaluationsByDateRange(
  startDate: string,
  endDate: string
): Promise<EvaluationData[]> {
  const db = await openDatabase();

  const result = await db.select<any[]>(
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
      e.created_at as timestamp,
      e.ai_detection_id as aiDetectionId,
      ad.overall_score,
      ad.sentence_scores,
      ad.tokens,
      ad.token_probs
    FROM evaluation e
    JOIN question q ON e.question_id = q.id
    JOIN rubric r ON e.rubric_id = r.id
    LEFT JOIN ai_detection ad ON e.ai_detection_id = ad.id
    WHERE DATE(e.created_at) BETWEEN ? AND ?
    ORDER BY e.created_at DESC
  `,
    [startDate, endDate]
  );

  // Transform the result to include properly structured AI detection data
  return result.map((row) => ({
    id: row.id,
    questionId: row.questionId,
    questionContent: row.questionContent,
    answer: row.answer,
    score: row.score,
    rubricId: row.rubricId,
    rubricName: row.rubricName,
    rubricContent: row.rubricContent,
    totalScore: row.totalScore,
    justification: row.justification,
    llmModel: row.llmModel,
    timestamp: row.timestamp,
    aiDetectionId: row.aiDetectionId,
    aiDetectionData: row.aiDetectionId
      ? {
          overall_score: row.overall_score,
          sentence_scores: JSON.parse(row.sentence_scores || "[]"),
          tokens: JSON.parse(row.tokens || "[]"),
          token_probs: JSON.parse(row.token_probs || "[]"),
          message: `We are ${Math.round(
            (row.overall_score || 0) * 100
          )}% certain that the answer is AI generated.`,
        }
      : null,
  }));
}

export async function getEvaluationsByQuestion(
  questionId: number
): Promise<EvaluationData[]> {
  const db = await openDatabase();

  const result = await db.select<any[]>(
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
      e.created_at as timestamp,
      e.ai_detection_id as aiDetectionId,
      ad.overall_score,
      ad.sentence_scores,
      ad.tokens,
      ad.token_probs
    FROM evaluation e
    JOIN question q ON e.question_id = q.id
    JOIN rubric r ON e.rubric_id = r.id
    LEFT JOIN ai_detection ad ON e.ai_detection_id = ad.id
    WHERE e.question_id = ?
    ORDER BY e.created_at DESC
  `,
    [questionId]
  );

  // Transform the result to include properly structured AI detection data
  return result.map((row) => ({
    id: row.id,
    questionId: row.questionId,
    questionContent: row.questionContent,
    answer: row.answer,
    score: row.score,
    rubricId: row.rubricId,
    rubricName: row.rubricName,
    rubricContent: row.rubricContent,
    totalScore: row.totalScore,
    justification: row.justification,
    llmModel: row.llmModel,
    timestamp: row.timestamp,
    aiDetectionId: row.aiDetectionId,
    aiDetectionData: row.aiDetectionId
      ? {
          overall_score: row.overall_score,
          sentence_scores: JSON.parse(row.sentence_scores || "[]"),
          tokens: JSON.parse(row.tokens || "[]"),
          token_probs: JSON.parse(row.token_probs || "[]"),
          message: `We are ${Math.round(
            (row.overall_score || 0) * 100
          )}% certain that the answer is AI generated.`,
        }
      : null,
  }));
}
