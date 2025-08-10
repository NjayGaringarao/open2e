import { Article } from "@/types/evaluation/learner";

export const getArticles = async (
  suggestedQuery: string
): Promise<{ articles: Article[]; error?: string }> => {
  try {
    const res = await fetch(`${OPEN2E_BACKEND}/api/articles/v1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suggestedQuery }),
    });

    if (!res.ok) {
      return { articles: [], error: await res.text() };
    }

    return await res.json();
  } catch (error: any) {
    return { articles: [], error: error.message || "Network error" };
  }
};
