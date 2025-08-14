import { z } from "zod";

export const EvaluationResultSchema = z.object({
  result: z.object({
    score: z.number().int().min(0).max(10),
    justification: z.string().min(1),
  }),
  suggested_query: z.string(),
  error: z.string().min(1).nullable(),
});

export type EvaluationResult = {
  result: {
    score: number | null;
    justification: string;
  };
  error?: string | null;
  suggested_query: string;
};
