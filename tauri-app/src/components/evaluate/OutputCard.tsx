import { useEvaluation } from "@/context/main/useEvaluation";
import clsx from "clsx";
import { nanoid } from "nanoid";
import ArticleItem from "./ArticleItem";
import SemiCircleProgress from "./SemiCircleProgress";
import { useEffect } from "react";
import {
  ArrowRight,
  Save,
  Eye,
  Trash2,
} from "lucide-react";
import Button from "../Button";
import Markdown from "../Markdown";
import { useNavigate } from "react-router";
import { useChat } from "@/context/main/chat";
import { detectAI } from "@/lib/sapling/detection";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

interface OutputCardProps {
  swiperRef?: React.RefObject<any>;
  onViewInput?: () => void;
}

const OutputCard = ({ swiperRef, onViewInput }: OutputCardProps) => {
  // All hooks must be called first, before any conditional returns
  const navigate = useNavigate();
  const { sendMessage } = useChat();
  const {
    sheet,
    selectedRubric,
    question,
    articleList,
    saveSheet,
    isLoading,
    clearResult,
    updateSheet,
  } = useEvaluation();

  const { status: connectionStatus } = useConnectionStatus();
  

  // Now define helper functions that use the hooks' values
  const createConversation = async () => {
    await navigate("/chat", {});
    await sendMessage(
      `Hello, Lets discuss about the topics related to this question: "${question.tracked}"`,
      true
    );
  };

  const handleViewInput = () => {
    if (swiperRef?.current) {
      swiperRef.current.slideTo(0);
    }
    onViewInput?.();
  };

  const handleClearResult = () => {
    clearResult();
    if (swiperRef?.current) {
      swiperRef.current.slideTo(0);
    }
  };

  // Speech interaction removed

  // useEffect must be called before any conditional returns
  // Removed effect that auto-started speech interaction

  // Helper function for token highlighting
  const getTokenHighlightStyle = (probability: number) => {
    const percentage = Math.round(probability * 100);

    if (percentage < 60) {
      return { backgroundColor: "rgba(34, 197, 94, 0.3)" }; // Green for low probability
    } else if (percentage >= 85) {
      return { backgroundColor: "rgba(239, 68, 68, 0.3)" }; // Red for high probability
    } else {
      return { backgroundColor: "rgba(234, 179, 8, 0.3)" }; // Yellow for medium probability
    }
  };

  // Now we can check and return early
  const hasResult = sheet.score !== null && sheet.justification !== "";

  // Trigger AI detection when committedAnswer changes
  useEffect(() => {
    const runDetection = async () => {
      if (connectionStatus === "OFFLINE" || !sheet.committedAnswer.trim()) {
        return;
      }

      const detectionResult = await detectAI(sheet.committedAnswer);

      if (detectionResult.error) {
        console.error("AI Detection error:", detectionResult.error);
      } else {
        const percent = Math.round(detectionResult.overall_score * 100);
        updateSheet((prev) => ({
          ...prev,
          detectedAI: percent,
          aiDetectionData: detectionResult,
        }));
      }
    };

    if (sheet.committedAnswer && hasResult) {
      runDetection();
    }
  }, [sheet.committedAnswer, connectionStatus, updateSheet, hasResult]);
  if (!hasResult) return null;

  return (
    <div className="flex flex-col border border-primary/80 rounded-lg h-full overflow-hidden">
      <div className="w-full bg-uGray p-4 flex flex-row justify-between items-center">
        <p className="text-background font-semibold text-xl">
          Evaluation Result
        </p>
        <div className="flex flex-row gap-2">
          <Button onClick={handleViewInput} className="w-34" title="View Input">
            <Eye className="w-4 h-4" />
          </Button>
          {!sheet.isEvaluationSaved && (
            <Button
              onClick={saveSheet}
              disabled={isLoading}
              className="w-34"
              title="Save"
            >
              <Save className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={handleClearResult}
            className="w-34 bg-uRed w-34"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 relative w-full flex flex-col gap-8 p-4 overflow-auto">
        <div className="flex flex-col items-center">
          {/* Score and Justification */}
          <div className="flex flex-col md:flex-row items-center gap-6 w-full p-6">
            <div
              className={clsx(
                "px-10 py-14 text-5xl font-extrabold text-uGray",
                typeof selectedRubric?.total_score === "number" &&
                  selectedRubric.total_score > 0
                  ? `bg-score-${Math.round(
                      ((sheet.score ?? 0) / selectedRubric.total_score) * 10
                    )}`
                  : "bg-score-0",
                "rounded-lg text-center shadow-sm",
                "flex flex-row items-end"
              )}
            >
              <div>
                {sheet.score} /{selectedRubric?.total_score}
              </div>
            </div>
            <ArrowRight className="hidden md:block h-10 w-10 text-uGrayLight" />
            <div
              className={clsx(
                "flex-1 flex flex-col gap-3 pr-1",
                "text-base text-uGrayLight font-mono",
                "shadow-md"
              )}
            >
              <div className="relative overflow-hidden">
                <div className="overflow-y-auto shadow-md rounded-md bg-background">
                  {/* Sticky Header */}
                  <div
                    className={clsx(
                      "sticky top-0 z-10 py-4 px-4",
                      "bg-panel/80 backdrop-blur-sm border-b border-uGrayLight",
                      "flex flex-row gap-1 items-center"
                    )}
                  >
                    <p className="font-semibold text-lg">Justification</p>
                    {/* Speech controls removed */}
                  </div>
                  <div className="px-4">
                    <Markdown text={sheet.justification} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Detection */}
        {sheet.detectedAI !== undefined && (
          <div className="flex flex-col gap-4">
            <p className="text-xl text-uGrayLight font-semibold">
              AI Detection Score
            </p>
            <div className="flex flex-row gap-6 items-center">
              <div className="flex flex-col items-center gap-3">
                <SemiCircleProgress
                  percentage={sheet.detectedAI}
                  size={180}
                  strokeWidth={20}
                />
              </div>
              {/* Token Highlights */}
              {sheet.aiDetectionData &&
                sheet.aiDetectionData.tokens.length > 0 && (
                  <div className="flex-1 bg-panel rounded-lg p-4">
                    <div className="flex flex-col items-start min-h-32 max-h-96 overflow-y-auto">
                      <div className="flex row flex-wrap">
                        {sheet.aiDetectionData.tokens.map((token, index) => (
                          <span
                            key={index}
                            className="px-0.5 py-0.5 text-base"
                            style={getTokenHighlightStyle(
                              sheet.aiDetectionData?.token_probs[index] || 0
                            )}
                          >
                            {token}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-uGrayLight border-t border-uGrayLightLight pt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-yellow-300 rounded"></div>
                        <span>Medium (60-84%)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-300 rounded"></div>
                        <span>High (85%+)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-300 rounded"></div>
                        <span>Low (&lt;60%)</span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
            {sheet.aiDetectionData && (
              <div className="flex flex-col w-full">
                <p className="text-sm text-uGrayLight italic">
                  Note: All AI detection systems have{" "}
                  <b>false positives and false</b> negatives. In some cases,
                  human-written (but perhaps rote) text can be misclassified as
                  AI-generated. Therefore,{" "}
                  <b>do not rely on the AI detection score alone </b> to
                  determine if the text is AI-generated.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Article List */}
        {articleList.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-xl font-semibold text-uGrayLight">
              Explore Further
            </p>
            <div className="grid grid-cols-2 gap-2">
              {articleList.map((article) => (
                <ArticleItem key={nanoid()} article={article} />
              ))}
            </div>
          </div>
        )}

        <div
          className={clsx(
            "flex flex-row w-full justify-center gap-1 mb-4",
            "text-lg text-uGrayLight"
          )}
        >
          <p>Interested with this topic?</p>
          <button
            className="underline underline-offset-2 hover:text-primary"
            onClick={createConversation}
          >
            Continue to Chat.
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutputCard;
