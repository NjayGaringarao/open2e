import { fetch } from "@tauri-apps/plugin-http";
import { OPEN2E_BACKEND } from "@/constant/hostname";
import { AIDetectionData } from "@/types/aiDetection";

export const detectAI = async (answer: string): Promise<AIDetectionData> => {
  try {
    const res = await fetch(`${OPEN2E_BACKEND}/api/detectAI/v1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });

    if (!res.ok) {
      return {
        overall_score: 0,
        sentence_scores: [],
        tokens: [],
        token_probs: [],
        message: "",
        error: "Failed to connect to the AI Detection service.",
      };
    }

    const data = await res.json();

    return {
      overall_score: data.overall_score,
      sentence_scores: data.sentence_scores || [],
      tokens: data.tokens || [],
      token_probs: data.token_probs || [],
      message: data.message || "",
      error: data.error,
    };
  } catch (error: any) {
    console.warn(error.message);

    return {
      overall_score: 0,
      sentence_scores: [],
      tokens: [],
      token_probs: [],
      message: "",
      error: "Failed to run ai detection.",
    };
  }
};
