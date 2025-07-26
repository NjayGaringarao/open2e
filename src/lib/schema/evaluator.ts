import { z } from "zod";

export const ResponseToEvaluatorSchema = z.object({
  result: z.object({
    score: z.number().int().min(0).max(10),
    justification: z.string().min(1),
  }),
  error: z.string().min(1).nullable(),
});
