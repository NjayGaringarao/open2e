import { Article } from "@/types/evaluation";
import { fetch } from "@tauri-apps/plugin-http";
import { OPEN2E_BACKEND } from "@/constant/hostname";

export const getArticles = async (
  suggestedQuery: string
): Promise<{ articles: Article[]; error?: string }> => {
  try {
    const res = await fetch(`${OPEN2E_BACKEND}/api/article/v1`, {
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
