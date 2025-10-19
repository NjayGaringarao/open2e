import BaseModal from "@/components/container/BaseModal";
import { Calendar, User, FileText, Award, Brain } from "lucide-react";
import type { EvaluationData } from "@/database/analytics/types";
import { cn } from "@/utils/style";
import { useState } from "react";
import { getRubricById, Rubric } from "@/database/rubric";
import Button from "../Button";
import ModalView from "../rubric/ModalView";

interface ModalEvaluationDetailProps {
  evaluation: EvaluationData | null;
  onClose: () => void;
}

const ModalEvaluationDetail = ({
  evaluation,
  onClose,
}: ModalEvaluationDetailProps) => {
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const getScoreColor = (score: number, totalScore: number) => {
    const percentage = (score / totalScore) * 100;
    if (percentage >= 80)
      return "bg-green-500/20 text-green-600 border-green-500/30";
    if (percentage >= 60)
      return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
    return "bg-red-500/20 text-red-600 border-red-500/30";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleShowRubric = async () => {
    if (!evaluation) return;
    const { rubric } = await getRubricById(evaluation.rubricId);

    setRubric(rubric ?? null);
  };

  return (
    <BaseModal
      isOpen={!!evaluation}
      onClose={onClose}
      title="Evaluation Details"
      panelClassName="w-full max-w-6xl"
    >
      {evaluation && (
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-row gap-4">
            {/* Score Display */}
            <div className="flex items-center justify-center">
              <div
                className={cn(
                  "px-12 py-20 flex flex-row items-end justify-center rounded-xl border text-4xl font-bold text-center",
                  getScoreColor(evaluation.score, evaluation.totalScore)
                )}
              >
                <p className="text-4xl font-bold">{evaluation.score}</p>
                <p className="text-base font-bold">/</p>
                <p className="text-base font-bold">{evaluation.totalScore}</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {/* Question Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-uGray font-semibold">
                  <FileText className="w-5 h-5" />
                  <span>Question</span>
                </div>
                <div className="px-4 py-2 bg-panel rounded-lg">
                  <p className="text-uGrayLight leading-relaxed">
                    {evaluation.questionContent}
                  </p>
                </div>
              </div>

              {/* Answer Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-uGray font-semibold">
                  <User className="w-5 h-5" />
                  <span>Answer</span>
                </div>
                <div className="px-4 py-2 bg-panel rounded-lg max-h-32 min-h-16 overflow-y-auto">
                  <p className="text-uGrayLight leading-relaxed whitespace-pre-wrap">
                    {evaluation.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Justification Section */}

          <div className="flex flex-col gap-2 text-uGray font-semibold">
            <div className="flex flex-row items-center justify-between">
              <div className="flex gap-2">
                <Award className="w-5 h-5" />
                <span>LLM's Justification for the Score</span>
              </div>
              <Button
                secondary
                onClick={handleShowRubric}
                className="shadow-none"
              >
                View Rubric Used for Scoring
              </Button>
            </div>
            <div className="px-4 py-2 bg-panel rounded-lg">
              <p className="text-uGrayLight leading-relaxed whitespace-pre-wrap">
                {evaluation.justification}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-row gap-4 justify-between pt-4 border-t border-uGrayLightLight">
            <div className="flex items-center gap-2 text-sm">
              <Brain className="w-4 h-4 text-uGrayLight" />
              <span className="text-uGrayLight">LLM Model Used:</span>
              <span className="text-uGray font-medium">
                {evaluation.llmModel}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-uGrayLight" />
              <span className="text-uGrayLight">Created:</span>
              <span className="text-uGray font-medium">
                {formatDate(evaluation.timestamp)}
              </span>
            </div>
          </div>
        </div>
      )}
      <ModalView rubric={rubric} onClose={() => setRubric(null)} />
    </BaseModal>
  );
};

export default ModalEvaluationDetail;
