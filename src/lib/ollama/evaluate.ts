import { Result } from "@/types/evaluation";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  getEvaluationInstruction,
  EVALUATION_EXAMPLES,
} from "../context/evaluation";
import { EvaluationResultSchema } from "../schema";
import { EVALUATION_MODEL } from "./models";
import { invoke } from "@tauri-apps/api/core";

interface IEvaluate {
  question: string;
  answer: string;
}

export const evaluate = async ({
  question,
  answer,
}: IEvaluate): Promise<{ result: Result | null; error?: string }> => {
  try {
    // optional: keeps your existing Tauri command to ensure Ollama is running
    await invoke("initialize_ollama");

    const userInput = `
QUESTION: ${question}
ANSWERS: ${answer}
`.trim();

    const messages = [
      { role: "system", content: getEvaluationInstruction() },
      ...EVALUATION_EXAMPLES,
      { role: "user", content: userInput },
    ];

    const body = {
      model: EVALUATION_MODEL,
      messages,
      temperature: 0,
      stream: false,
      // include zod JSON schema in case Ollama honors the "format" field
      format: zodToJsonSchema(EvaluationResultSchema),
    };

    const res = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

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

    const evaluation = EvaluationResultSchema.parse(parsedContent);

    return { result: evaluation };
  } catch (error: any) {
    console.warn(error);
    return { result: null, error: error?.message ?? String(error) };
  }
};
