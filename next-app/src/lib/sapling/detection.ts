import { SAPLING_API_KEY } from "@/constant/env";
import axios from "axios";

export interface SentenceScore {
  score: number;
  sentence: string;
}

export interface AIDetectionResult {
  overall_score: number;
  sentence_scores: SentenceScore[];
  tokens: string[];
  token_probs: number[];
  message: string;
  error?: string;
}

export const detectAI = async (answer: string): Promise<AIDetectionResult> => {
  try {
    const response = await axios.post(
      "https://api.sapling.ai/api/v1/aidetect",
      {
        key: SAPLING_API_KEY,
        text: answer,
      }
    );

    const { status, data } = response;
    console.log(JSON.stringify({ status, data }));

    return {
      overall_score: data.score ?? 0,
      sentence_scores: data.sentence_scores ?? [],
      tokens: data.tokens ?? [],
      token_probs: data.token_probs ?? [],
      message: `We are ${(data.score * 100).toFixed(
        2
      )}% certain that the answer is AI generated.`,
    };
  } catch (error) {
    return {
      overall_score: 0,
      sentence_scores: [],
      tokens: [],
      token_probs: [],
      message: "",
      error: `${error}` || "Failed to connect to Sapling API.",
    };
  }
};

export const mockDetectAI = (): AIDetectionResult => {
  // Sample text for demonstration
  const sampleText =
    "This is a sample answer that might contain AI-generated content.";
  const sampleTokens = sampleText.split(" ");

  return {
    overall_score: 0.2,
    sentence_scores: [
      {
        score: 0.15,
        sentence:
          "This is a sample answer that might contain AI-generated content.",
      },
    ],
    tokens: sampleTokens,
    token_probs: [0.1, 0.1, 0.1, 0.1, 0.3, 0.4, 0.2, 0.2, 0.5, 0.6, 0.7],
    message: "We are 20% certain that the answer is AI Generated.",
  };
};
