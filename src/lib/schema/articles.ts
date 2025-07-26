import { z } from "zod";

export const ArticleResultSchema = z.object({
  articles: z.array(
    z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      url: z.string().min(1),
    })
  ),
});
