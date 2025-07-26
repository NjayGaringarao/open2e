import { z } from "zod";

export const ResponseToLearnerSchema = z.object({
  result: z.object({
    score: z.number().int().min(0).max(10),
    justification: z.string().min(1),
  }),
  suggested_query: z.string(),
  error: z.string().min(1).nullable(),
});
