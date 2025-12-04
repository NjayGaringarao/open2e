import { Result } from "@/types/evaluation";
import { fetch } from "@tauri-apps/plugin-http";
import { OPEN2E_BACKEND } from "@/constant/hostname";
import { getRubricExamples } from "@/database/rubric_example";
import { EvaluationExample } from "@/lib/context/evaluation/examples";

interface IEvaluate {
  question: string;
  answer: string;
  rubric?: string;
  totalScore?: number;
  rubricId?: number;
  signal?: AbortSignal;
}

export const evaluate = async ({
  question,
  answer,
  rubric,
  totalScore = 10,
  rubricId,
  signal,
}: IEvaluate): Promise<{ result: Result | null; error?: string }> => {
  try {
    // Fetch examples from database if rubricId is provided
    let examples: EvaluationExample[] | undefined = undefined;
    if (rubricId) {
      const { examples: dbExamples, error: examplesError } =
        await getRubricExamples(rubricId);
      if (!examplesError && dbExamples.length > 0) {
        examples = dbExamples;
      }
    }

    const res = await fetch(`${OPEN2E_BACKEND}/api/evaluate/v2`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer, rubric, totalScore, examples }),
      signal,
    });

    if (!res.ok) {
      return { result: null, error: await res.text() };
    }

    return await res.json();
  } catch (error: any) {
    // Don't report error if it was aborted
    if (error.name === "AbortError" || signal?.aborted) {
      return { result: null, error: "Cancelled" };
    }
    console.log(error);
    return { result: null, error: error.message || "Network error" };
  }
};
