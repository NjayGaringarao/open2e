import { Result } from "@/types/evaluation";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  getEvaluationInstruction,
  // createEvaluationExamples,
} from "../context/evaluation";
import { createEvaluationResultSchema } from "../schema";
import { EVALUATION_MODEL } from "./models";
import { initializeOllama, isLocalLLMInstalled } from "./utils";
import { fetch } from "@tauri-apps/plugin-http";
import { ENVIRONMENT } from "@/constant/env";

interface IEvaluate {
  question: string;
  answer: string;
  rubric?: string;
  totalScore?: number;
  signal?: AbortSignal;
}

// Mock evaluation function (similar to backend's mockEvaluation)
export const mockEvaluation = (totalScore: number = 10): Result => {
  return {
    result: {
      score: Math.floor(Math.random() * (totalScore + 1)),
      justification: "This Response is for development purpose only.",
    },
    suggested_query: "computer literacy basics",
    error: null,
  };
};

export const evaluate = async ({
  question,
  answer,
  rubric,
  totalScore = 10,
  signal,
}: IEvaluate): Promise<{ result: Result | null; error?: string }> => {
  // Check if cancelled before starting
  if (signal?.aborted) {
    return { result: null, error: "Cancelled" };
  }

  // Development mode: return mock data
  if (ENVIRONMENT !== "PRODUCTION") {
    // Simulate a small delay to allow cancellation
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (signal?.aborted) {
      return { result: null, error: "Cancelled" };
    }
    return { result: mockEvaluation(totalScore) };
  }

  try {
    // optional: keeps your existing Tauri command to ensure Ollama is running
    const installed = await isLocalLLMInstalled();
    if (!installed) {
      throw new Error("Local LLM dependencies are not installed.");
    }

    await initializeOllama();

    const userInput = `
QUESTION: ${question}
ANSWERS: ${answer}
`.trim();

    const instruction = getEvaluationInstruction(rubric, totalScore);
    const dynamicSchema = createEvaluationResultSchema(totalScore);
    // const dynamicExamples = createEvaluationExamples(totalScore);

    const messages = [
      { role: "system", content: instruction },
      // ...dynamicExamples,
      { role: "user", content: userInput },
    ];

    const body = {
      model: EVALUATION_MODEL,
      messages,
      temperature: 0,
      stream: false,
      // include zod JSON schema in case Ollama honors the "format" field
      format: zodToJsonSchema(dynamicSchema),
    };

    const res = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });

    // Check if cancelled
    if (signal?.aborted) {
      return { result: null, error: "Cancelled" };
    }

    if (!res.ok) {
      throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Try several possible response shapes Ollama might return
    const rawContent =
      data?.message?.content ??
      data?.response ??
      (typeof data === "string" ? data : null) ??
      (Array.isArray(data)
        ? data[0]?.content ?? data[0]?.message?.content
        : null) ??
      null;

    if (!rawContent) {
      throw new Error("No content returned from Ollama");
    }

    // rawContent might already be an object or might be a JSON string
    let parsedContent: any;
    if (typeof rawContent === "string") {
      parsedContent = JSON.parse(rawContent);
    } else {
      parsedContent = rawContent;
    }

    // Check if cancelled before parsing
    if (signal?.aborted) {
      return { result: null, error: "Cancelled" };
    }

    const evaluation = dynamicSchema.parse(parsedContent);

    return { result: evaluation };
  } catch (error: any) {
    // Don't report error if it was aborted
    if (error.name === "AbortError" || signal?.aborted) {
      return { result: null, error: "Cancelled" };
    }
    console.warn(error);
    return { result: null, error: error?.message ?? String(error) };
  }
};
