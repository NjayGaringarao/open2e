import { LearnerResult } from "@/types/evaluation/learner";
import { zodToJsonSchema } from "zod-to-json-schema";
import ollama from "ollama";
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
}: IEvaluate): Promise<{ result: LearnerResult | null; error?: string }> => {
  try {
    await invoke("initialize_ollama");
    const input = `
    QUESTION: ${question}
    ANSWERS: ${answer}
    `;

    const res = await ollama.chat({
      model: EVALUATION_MODEL,
      options: {
        temperature: 0,
      },
      messages: [
        { role: "system", content: getEvaluationInstruction() },
        ...EVALUATION_EXAMPLES,
        { role: "user", content: input },
      ],
      format: zodToJsonSchema(EvaluationResultSchema),
    });

    const evaluation = EvaluationResultSchema.parse(
      JSON.parse(res.message.content)
    );

    return { result: evaluation };
  } catch (error: any) {
    console.warn(error);
    return { result: null, error: error.message };
  }
};
