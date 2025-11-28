import { z } from "zod";

export const createEvaluationResultSchema = (totalScore: number = 10) =>
  z.object({
    result: z.object({
      score: z.number().int().min(0).max(totalScore),
      justification: z.string().min(1),
    }),
    suggested_query: z.string(),
    error: z.string().min(1).nullable(),
  });

export const EvaluationResultSchema = createEvaluationResultSchema();
