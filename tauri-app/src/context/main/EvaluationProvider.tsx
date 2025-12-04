import { ReactNode, useState, useEffect, useRef } from "react";
import { EvaluationContext, Question } from "./EvaluationContext";
import { Article, Result, SheetData } from "@/types/evaluation";
import { DEFAULT_LEARNERSHEET } from "@/constant/default";
import { useSettings } from "./settings";
import * as openai from "@/lib/openai";
import * as ollama from "@/lib/ollama";
import { useDialog } from "@/context/dialog";
import { add } from "@/database/evaluation";
import { insertAIDetection } from "@/database/aiDetection";
import { LOCAL_MODEL, ONLINE_MODEL } from "@/constant/llmModel";
import { useAnalyticsContext } from "./analytics/AnalyticsContext";
import { useRubric } from "./rubric";
import { Rubric } from "@/database/rubric";
import { RECOMMENDED_MEMORY } from "@/constant/memory";
import { useStatus, LLMStatus } from "./status";

export const EvaluationProvider = ({ children }: { children: ReactNode }) => {
  const { status: llmStatus } = useStatus();
  const { triggerRefresh } = useAnalyticsContext();
  const { systemMemory } = useSettings();
  const { alert } = useDialog();
  const { rubrics } = useRubric();
  const isOnline = llmStatus === LLMStatus.ONLINE;
  const canRunOffline = llmStatus === LLMStatus.OFFLINE_READY;
  const insufficientMemory = llmStatus === LLMStatus.OFFLINE_LOW_RAM;
  const missingDependencies = llmStatus === LLMStatus.OFFLINE_NOT_SETUP;
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [question, setQuestion] = useState<Question>({
    tracked: "",
    committed: "",
  });
  const [sheet, setSheet] = useState<SheetData>(DEFAULT_LEARNERSHEET);
  const [selectedRubric, setSelectedRubric] = useState<Rubric | null>(null);

  // Cancellation state
  const currentEvaluationIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get model name for display
  const evaluationModelName = isOnline
    ? "GPT-4o (Online)"
    : canRunOffline
    ? "Phi4-mini (Offline)"
    : "GPT-4o/Phi4-mini";

  // Load default rubric on mount
  useEffect(() => {
    if (rubrics.length > 0 && !selectedRubric) {
      // Set the first rubric (default) as selected
      console.log("Setting default rubric:", rubrics[0].name);
      setSelectedRubric(rubrics[0]);
    }
  }, [rubrics]);

  const loadArticles = async (suggestedQuery: string) => {
    // Implementation of article query using Openai
    const fetchArticles = async () => {
      const { articles, error } = await openai.getArticles(suggestedQuery);

      if (error || articles.length === 0) {
        const query = suggestedQuery;
        const encoded = encodeURIComponent(query);
        const url = `https://www.google.com/search?q=${encoded}`;

        setArticleList([
          {
            title: "Failed to Search",
            subtitle:
              "Click this to directly open your browser for suggested query",
            url: url,
          },
        ]);
      } else {
        setArticleList(articles);
      }
    };

    if (question.committed !== question.tracked || articleList.length === 0) {
      if (isOnline) {
        await fetchArticles();
      } else {
        setArticleList([
          {
            title: "Google",
            subtitle: `Search: ${suggestedQuery}`,
            url: `https://www.google.com/search?q=${suggestedQuery}`,
          },
        ]);
      }
    }
  };

  const cancelEvaluation = () => {
    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Increment evaluation ID to invalidate any late results
    currentEvaluationIdRef.current += 1;

    // Reset evaluation state
    setIsEvaluating(false);
    setIsLoading(false);

    // Clear transient evaluation state (full reset)
    setArticleList([]);
    setSheet((prev) => ({
      ...prev,
      score: null,
      justification: "",
      committedAnswer: "",
      detectedAI: undefined,
      aiDetectionData: undefined,
    }));
  };

  const evaluateSheet = async () => {
    // Auto-cancel previous evaluation if one is in progress
    if (isEvaluating && abortControllerRef.current) {
      cancelEvaluation();
    }

    // Create new evaluation ID and abort controller
    const evaluationId = ++currentEvaluationIdRef.current;
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsEvaluating(true);
    setIsLoading(true);

    let evaluation: Result | null = null;

    // Implementation of evaluation using openai
    const evaluateOnline = async (): Promise<Result | null> => {
      // Check if cancelled
      if (
        abortController.signal.aborted ||
        evaluationId !== currentEvaluationIdRef.current
      ) {
        return null;
      }

      console.log(
        "Evaluating with rubric:",
        selectedRubric?.name,
        "Content:",
        selectedRubric?.content?.substring(0, 100) + "..."
      );
      const { result, error } = await openai.evaluate({
        question: question.tracked,
        answer: sheet.trackedAnswer,
        rubric: selectedRubric?.content,
        totalScore: selectedRubric?.total_score || 10,
        rubricId: selectedRubric?.id,
        signal: abortController.signal,
      });

      // Check if cancelled after request
      if (
        abortController.signal.aborted ||
        evaluationId !== currentEvaluationIdRef.current
      ) {
        return null;
      }

      if (error || !result) {
        return null;
      }

      return result;
    };

    // Implementation of evaluation using ollama
    const evaluateOffline = async (): Promise<Result | null> => {
      // Check if cancelled
      if (
        abortController.signal.aborted ||
        evaluationId !== currentEvaluationIdRef.current
      ) {
        return null;
      }

      if (!canRunOffline) {
        if (
          abortController.signal.aborted ||
          evaluationId !== currentEvaluationIdRef.current
        ) {
          return null;
        }
        if (insufficientMemory) {
          alert({
            title: "Evaluation Unavailable",
            description: `Not enough system memory detected (${systemMemory}GB). Offline evaluation requires at least ${RECOMMENDED_MEMORY}GB or an internet connection.`,
            mode: "ERROR",
          });
        } else if (missingDependencies) {
          alert({
            title: "Evaluation Unavailable",
            description:
              "Local AI dependencies are missing. Install Ollama and download the phi4-mini model, or reconnect to the internet.",
            mode: "ERROR",
          });
        } else {
          alert({
            title: "Evaluation Unavailable",
            description:
              "Offline evaluation is not available right now. Please reconnect to the internet.",
            mode: "ERROR",
          });
        }
        return null;
      }

      // Check if cancelled before starting evaluation
      if (
        abortController.signal.aborted ||
        evaluationId !== currentEvaluationIdRef.current
      ) {
        return null;
      }

      console.log(
        "Evaluating with rubric (Ollama):",
        selectedRubric?.name,
        "Content:",
        selectedRubric?.content?.substring(0, 100) + "..."
      );
      const { result, error } = await ollama.evaluate({
        question: question.tracked,
        answer: sheet.trackedAnswer,
        rubric: selectedRubric?.content,
        totalScore: selectedRubric?.total_score || 10,
        rubricId: selectedRubric?.id,
        signal: abortController.signal,
      });

      // Check if cancelled after request
      if (
        abortController.signal.aborted ||
        evaluationId !== currentEvaluationIdRef.current
      ) {
        return null;
      }

      if (error || !result) {
        if (!abortController.signal.aborted) {
          alert({
            title: "Evaluation Failed",
            description: `Evaluation Failed: ${
              error ?? "There was an issue running evaluation."
            }`,
            mode: "ERROR",
          });
        }
        return null;
      }

      return result;
    };

    if (isOnline) {
      evaluation = await evaluateOnline();
      // Check cancellation before fallback
      if (
        !evaluation &&
        canRunOffline &&
        !abortController.signal.aborted &&
        evaluationId === currentEvaluationIdRef.current
      ) {
        evaluation = await evaluateOffline();
      }
    } else {
      evaluation = await evaluateOffline();
    }

    // Check if this evaluation was cancelled (late result from previous evaluation)
    if (
      evaluationId !== currentEvaluationIdRef.current ||
      abortController.signal.aborted
    ) {
      setIsEvaluating(false);
      setIsLoading(false);
      abortControllerRef.current = null;
      return;
    }

    // Load articles if evaluation succeeded
    if (evaluation) {
      await loadArticles(evaluation.suggested_query);
    }

    setIsEvaluating(false);
    setIsLoading(false);
    abortControllerRef.current = null;

    if (evaluation === null) return;

    // If no error occur, commit the trackedAnswer, question.tracked, and scores
    setQuestion((prev) => ({ ...prev, committed: prev.tracked }));
    setSheet((prev) => ({
      ...prev,
      isEvaluationSaved: false,
      committedAnswer: prev.trackedAnswer,
      score: evaluation.result.score,
      justification: evaluation.result.justification,
    }));
  };

  const saveSheet = async () => {
    if (sheet.score === null) return;
    setIsLoading(true);

    let aiDetectionId: number | undefined;

    // First, insert AI detection data if available
    if (sheet.aiDetectionData) {
      const { id, error: aiError } = await insertAIDetection(
        sheet.aiDetectionData
      );
      if (aiError) {
        alert({
          title: "AI Detection Save Failed",
          description: "There was an error saving AI detection data.",
          mode: "ERROR",
        });
        setIsLoading(false);
        return;
      }
      aiDetectionId = id;
    }

    const { error } = await add({
      question: question.committed,
      answer: sheet.committedAnswer,
      score: sheet.score,
      justification: sheet.justification,
      llm_model: llmStatus === LLMStatus.ONLINE ? ONLINE_MODEL : LOCAL_MODEL,
      ai_detection_id: aiDetectionId,
      rubric_id: selectedRubric?.id || 1,
    });

    if (error) {
      alert({
        title: "Save Failed",
        description: "There was an error saving the evaluation.",
        mode: "ERROR",
      });
    } else {
      setSheet((prev) => ({ ...prev, isEvaluationSaved: true }));
      triggerRefresh();
      alert({
        title: "Evaluation Saved",
        description: "Your evaluation has been saved and analytics updated.",
        mode: "SUCCESS",
      });
    }
    setIsLoading(false);
  };

  const clearSheet = () => {
    setSheet(DEFAULT_LEARNERSHEET);
  };

  const clearResult = () => {
    setSheet((prev) => ({
      ...prev,
      score: null,
      justification: "",
      committedAnswer: "",
      detectedAI: undefined,
      aiDetectionData: undefined,
    }));
    setArticleList([]);
  };

  return (
    <EvaluationContext.Provider
      value={{
        question,
        updateQuestion: setQuestion,
        isLoading,
        isEvaluating,
        cancelEvaluation,
        evaluationModelName,
        sheet,
        updateSheet: setSheet,
        evaluateSheet,
        saveSheet,
        clearSheet,
        clearResult,
        articleList,
        selectedRubric,
        updateSelectedRubric: (rubric) => {
          console.log("Rubric selection changed to:", rubric?.name);
          setSelectedRubric(rubric);
        },
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};
