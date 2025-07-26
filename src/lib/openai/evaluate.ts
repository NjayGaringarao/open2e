import { EvaluatorResult } from "@/types/evaluation/evaluator";
import { UserRole } from "@/types/config";
import { OpenAI } from "openai";
import {
  LEARNER_MODE_INSTRUCTION,
  EVALUATOR_MODE_INSTRUCTION,
} from "../context/instruction";
import { zodTextFormat } from "openai/helpers/zod";
import { ResponseToEvaluatorSchema, ResponseToLearnerSchema } from "../schema";
import { EVALUATION_MODEL } from "./models";
import { LearnerResult } from "@/types/evaluation/learner";

interface IEvaluateInput {
  question: string;
  answer: string;
}

//#region Overloads

export function evaluate(
  userRole: "LEARNER",
  apiKey: string,
  input: IEvaluateInput
): Promise<LearnerResult>;

export function evaluate(
  userRole: "EVALUATOR",
  apiKey: string,
  input: IEvaluateInput
): Promise<EvaluatorResult>;

export async function evaluate(
  userRole: Exclude<UserRole, undefined>,
  apiKey: string,
  { question, answer }: IEvaluateInput
): Promise<LearnerResult | EvaluatorResult> {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  const input = `
  QUESTION: ${question}
  ANSWERS: ${answer}
  `;

  if (userRole == "LEARNER") {
    return await evaluateLearner(openai, input);
  } else {
    return await evaluateEvaluator(openai, input);
  }
}

//#region Main Logic
const evaluateLearner = async (
  openai: OpenAI,
  input: string
): Promise<LearnerResult> => {
  console.log({ input });
  const response = await openai.responses.create({
    model: EVALUATION_MODEL,
    instructions: LEARNER_MODE_INSTRUCTION(),
    input: input,
    temperature: 0,
    text: {
      format: zodTextFormat(ResponseToLearnerSchema, "EvaluationToLearner"),
    },
  });

  try {
    const validated = ResponseToLearnerSchema.parse(
      JSON.parse(response.output_text.trim())
    );
    return validated;
  } catch (err) {
    console.error(
      "lib.openai.evaluateLearner :: JSON parsing or schema validation failed:",
      err
    );
    throw new Error("Openai returned invalid or unstructured JSON.");
  }
};

const evaluateEvaluator = async (
  openai: OpenAI,
  input: string
): Promise<EvaluatorResult> => {
  const response = await openai.responses.create({
    model: EVALUATION_MODEL,
    instructions: EVALUATOR_MODE_INSTRUCTION(),
    input: input,
    temperature: 0,
    text: {
      format: zodTextFormat(ResponseToEvaluatorSchema, "EvaluationToEvaluator"),
    },
  });

  try {
    const validated = ResponseToEvaluatorSchema.parse(
      JSON.parse(response.output_text.trim())
    );
    return validated;
  } catch (err) {
    console.error(
      "lib.openai.evaluateEvaluator :: JSON parsing or schema validation failed:",
      err
    );
    throw new Error("Openai returned invalid or unstructured JSON.");
  }
};
