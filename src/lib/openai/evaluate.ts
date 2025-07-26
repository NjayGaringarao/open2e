import { EvaluatorResult } from "@/types/evaluation/evaluator";
import { LearnerResult } from "@/types/evaluation/learner";
import { UserRole } from "@/types/config";
import { OpenAI } from "openai";
import {
  LEARNER_MODE_INSTRUCTION,
  EVALUATOR_MODE_INSTRUCTION,
} from "../context/instruction";
import { zodTextFormat } from "openai/helpers/zod";
import { ResponseToEvaluatorSchema, ResponseToLearnerSchema } from "../schema";
import { EVALUATION_MODEL } from "./models";

interface IEvaluateInput {
  question: string;
  answer: string;
}

//#region Overloads

//#region Overloads
export function evaluate(
  userRole: "LEARNER",
  apiKey: string,
  input: IEvaluateInput
): Promise<{ result: LearnerResult | null; error?: string }>;

export function evaluate(
  userRole: "EVALUATOR",
  apiKey: string,
  input: IEvaluateInput
): Promise<{ result: EvaluatorResult | null; error?: string }>;

// Implementation signature (must be compatible with both above)
export async function evaluate(
  userRole: Exclude<UserRole, undefined>,
  apiKey: string,
  { question, answer }: IEvaluateInput
): Promise<{
  result: LearnerResult | EvaluatorResult | null;
  error?: string;
}> {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  const input = `
  QUESTION: ${question}
  ANSWERS: ${answer}
  `;

  try {
    if (userRole === "LEARNER") {
      const result = await evaluateLearner(openai, input);
      return { result };
    } else {
      const result = await evaluateEvaluator(openai, input);
      return { result };
    }
  } catch (error) {
    console.error("lib.openai.evaluate :: Error occurred:", error);
    return { result: null, error: `${error}` };
  }
}

//#region Main Logic
const evaluateLearner = async (
  openai: OpenAI,
  input: string
): Promise<LearnerResult> => {
  const response = await openai.responses.create({
    model: EVALUATION_MODEL,
    instructions: LEARNER_MODE_INSTRUCTION(),
    input,
    temperature: 0,
    text: {
      format: zodTextFormat(ResponseToLearnerSchema, "EvaluationToLearner"),
    },
  });

  const raw = response.output_text?.trim();
  if (!raw) throw new Error("No content returned from OpenAI");

  return ResponseToLearnerSchema.parse(JSON.parse(raw));
};

const evaluateEvaluator = async (
  openai: OpenAI,
  input: string
): Promise<EvaluatorResult> => {
  const response = await openai.responses.create({
    model: EVALUATION_MODEL,
    instructions: EVALUATOR_MODE_INSTRUCTION(),
    input,
    temperature: 0,
    text: {
      format: zodTextFormat(ResponseToEvaluatorSchema, "EvaluationToEvaluator"),
    },
  });

  const raw = response.output_text?.trim();
  if (!raw) throw new Error("No content returned from OpenAI");

  return ResponseToEvaluatorSchema.parse(JSON.parse(raw));
};
