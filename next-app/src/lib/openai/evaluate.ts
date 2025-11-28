import { OpenAI } from "openai";
import { getEvaluationInstruction } from "@/lib/context/instruction";
import { zodResponseFormat } from "openai/helpers/zod";
import { createEvaluationResultSchema } from "@/lib/schema";
import { EVALUATION_MODEL, OPENAI_API_KEY } from "@/constant/env";
import { createEvaluationExamples } from "@/lib/context/examples";
import { EvaluationResult } from "@/types/evaluation";

interface IEvaluateInput {
  question: string;
  answer: string;
  rubric: string;
  totalScore?: number;
}

export async function evaluate({
  question,
  answer,
  rubric,
  totalScore = 10,
}: IEvaluateInput): Promise<{
  result: EvaluationResult | null;
  error?: string;
}> {
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  const input = `
  QUESTION: ${question}
  ANSWERS: ${answer}
  `;

  try {
    const dynamicSchema = createEvaluationResultSchema(totalScore);
    const dynamicExamples = createEvaluationExamples(totalScore);

    const raw = await openai.chat.completions.create({
      model: EVALUATION_MODEL,
      temperature: 0,
      response_format: zodResponseFormat(dynamicSchema, "EvaluationToLearner"),
      messages: [
        {
          role: "system",
          content: getEvaluationInstruction(rubric, totalScore),
        },
        ...dynamicExamples,
        { role: "user", content: input },
      ],
    });

    if (!raw || !raw.choices?.[0].message.content)
      throw new Error("No response returned from OpenAI");

    console.log(JSON.stringify(raw.usage, null, 2));

    const result = dynamicSchema.parse(
      JSON.parse(raw.choices[0].message.content)
    );

    return { result };
  } catch (error) {
    console.error("lib.openai.evaluate :: Error occurred:", error);
    return { result: null, error: `${error}` };
  }
}

export const mockEvaluation = (totalScore: number = 10) => {
  return {
    result: {
      score: Math.floor(Math.random() * (totalScore + 1)),
      justification: "This Response is for development purpose only.",
    },
    suggested_query: "",
  };
};
