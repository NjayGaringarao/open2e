import { Article } from "@/types/articles";
import OpenAI from "openai";
import { ArticleResultSchema } from "@/lib/schema/articles";
import { getArticleInstruction } from "@/lib/context/article";
import { OPENAI_API_KEY, WEB_SEARCH_MODEL } from "@/constant/env";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

export async function fetchArticles(
  suggestedQuery: string
): Promise<{ articles: Article[]; error?: string }> {
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
  const input = `Search Query: ${suggestedQuery}`;
  try {
    const response = await openai.chat.completions.create({
      model: WEB_SEARCH_MODEL,
      response_format: zodResponseFormat(ArticleResultSchema, "ArticleResult"),
      messages: [
        {
          role: "system",
          content: getArticleInstruction(),
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

export const fetchMockArticles = () => {
  const MOCK_ARTICLE: Article[] = [
    {
      title: "Understanding the Evolution of RAM: From SDR to DDR5",
      subtitle:
        "A comprehensive overview of the progression from Single Data Rate to Double Data Rate 5 memory technologies.",
      url: "https://www.decodeit.co.ke/ram.html",
    },
    {
      title: "Youtube",
      subtitle: "This is just a mock Article",
      url: "https://youtube.com",
    },
    {
      title: "DDR5 SDRAM: The Next Generation of Memory",
      subtitle:
        "An in-depth look at DDR5 SDRAM, its features, and how it compares to previous generations.",
      url: "https://en.wikipedia.org/wiki/DDR5_SDRAM",
    },
    {
      title:
        "RAM Buying & Usage Guide | DDR4, DDR5 RAM Recommendations | DRAM, SDRAM, DDR RAM, Memory | RAM Overclocking - OC | Product Guides - Bite Sized Tech",
      subtitle:
        "A guide to understanding different RAM technologies, their generations, and recommendations for DDR4 and DDR5 RAM.",
      url: "https://bitesizedtech.com/post/ram-buying-usage-guide-ddr4-ddr5-ram-recommendations-dram-overclocking/",
    },
  ];

  return MOCK_ARTICLE;
};
