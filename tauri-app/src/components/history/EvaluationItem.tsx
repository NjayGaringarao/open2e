import { EvaluationData } from "@/database/analytics";
import { cn } from "@/utils/style";

interface EvaluationItemProps {
  evaluation: EvaluationData;
  setSelectedEvaluation: (evaluation: EvaluationData) => void;
}

const EvaluationItem = ({
  evaluation,
  setSelectedEvaluation,
}: EvaluationItemProps) => {
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getScoreColor = (score: number, totalScore: number) => {
    const percentage = (score / totalScore) * 100;
    if (percentage >= 80)
      return "bg-green-500/20 text-green-600 border-green-500/30";
    if (percentage >= 60)
      return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
    return "bg-red-500/20 text-red-600 border-red-500/30";
  };

  return (
    <>
      <div
        onClick={() => setSelectedEvaluation(evaluation)}
        className="group cursor-pointer p-4 rounded-lg border border-uGrayLightLight hover:bg-secondary transition-all duration-200"
      >
        <div className="flex flex-row justify-between items-center">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-uGray group-hover:text-primary transition-color line-clamp-1">
              {truncateText(evaluation.questionContent)}
            </h3>
            <p className="text-uGrayLight text-sm leading-relaxed line-clamp-1">
              Answer: {truncateText(evaluation.answer)}
            </p>
            <div className="flex items-center gap-2 text-xs text-uGrayLightLight">
              <span>{evaluation.rubricName}</span>
              <span>•</span>
              <span>{evaluation.llmModel}</span>
              <span>•</span>
              <span>{new Date(evaluation.timestamp).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div
              className={cn(
                "px-3 py-1 rounded-md border text-sm font-semibold shadow-none",
                getScoreColor(evaluation.score, evaluation.totalScore)
              )}
            >
              {evaluation.score}/{evaluation.totalScore}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EvaluationItem;
