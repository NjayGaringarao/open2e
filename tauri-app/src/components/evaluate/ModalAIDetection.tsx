import BaseModal from "../container/BaseModal";
import { AIDetectionData } from "@/types/aiDetection";

interface ModalAIDetectionProps {
  isOpen: boolean;
  onClose: () => void;
  aiDetectionData: AIDetectionData | null;
}

const ModalAIDetection = ({
  isOpen,
  onClose,
  aiDetectionData,
}: ModalAIDetectionProps) => {
  if (!aiDetectionData) return null;

  const overallScore = Math.round(aiDetectionData.overall_score * 100);

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

  const getScoreColor = (score: number) => {
    const percentage = Math.round(score * 100);
    if (percentage >= 85) return "text-red-500";
    if (percentage >= 60) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Detection Analysis"
      panelClassName="max-w-4xl"
    >
      <div className="flex flex-col gap-4 p-6">
        {/* Overall Score */}

        <div className="flex flex-row items-center gap-2 text-2xl text-uGrayLight">
          <h3>Overall AI Detection Score:</h3>
          <span
            className={`text-2xl font-bold ${getScoreColor(
              aiDetectionData.overall_score
            )}`}
          >
            {overallScore}%
          </span>
        </div>

        {/* Token Highlights */}
        {aiDetectionData.tokens.length > 0 && (
          <div className="bg-panel rounded-lg p-4">
            <div className="flex flex-col items-start min-h-32 max-h-96 overflow-y-auto">
              <div className="flex row flex-wrap">
                {aiDetectionData.tokens.map((token, index) => (
                  <span
                    key={index}
                    className="px-0.5 py-0.5 text-base"
                    style={getTokenHighlightStyle(
                      aiDetectionData.token_probs[index] || 0
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
        <div className="flex flex-col w-full">
          <p className="text-sm text-uGrayLight italic">
            Note: All AI detection systems have <b>false positives and false</b>{" "}
            negatives. In some cases, human-written (but perhaps rote) text can
            be misclassified as AI-generated. Therefore,{" "}
            <b>
              do not rely on the AI do not rely on the AI detection score alone{" "}
            </b>{" "}
            to determine if the text is AI-generated.
          </p>
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalAIDetection;
