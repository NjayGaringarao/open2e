import { Article } from "@/types/evaluation/learner";
import OpenAI from "openai";
import { ArticleResultSchema } from "../schema/articles";
import { OPENAI_ARTICLE_CONTEXT } from "../context/article";
import { WEB_SEARCH_MODEL } from "./models";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

export async function fetchArticles(
  apiKey: string,
  suggestedQuery: string
): Promise<{ articles: Article[]; error?: string }> {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  const input = `Search Query: ${suggestedQuery}`;
  try {
    const response = await openai.chat.completions.create({
      model: WEB_SEARCH_MODEL,
      response_format: zodResponseFormat(ArticleResultSchema, "ArticleResult"),
      messages: [
        {
          role: "system",
          content: OPENAI_ARTICLE_CONTEXT(),
        },
        {
          role: "user",
          content: input,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content?.trim();
    if (!raw) throw new Error("No content in response");

    const parsed = ArticleResultSchema.parse(JSON.parse(raw));
    return { articles: parsed.articles };
  } catch (error) {
    console.error("lib.openai.articles :: Article fetch error:", error);
    return { articles: [], error: `${error}` };
  }
}
