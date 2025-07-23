import { z } from "zod";

export const ResponseToLearnerSchema = z.object({
  results: z.object({
    score: z.number().int().min(0).max(10),
    justification: z.string().min(1),
  }),
  suggested_queries: z.string(),
  error: z.string().min(1).nullable(),
});
