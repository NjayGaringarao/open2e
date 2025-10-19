import { useState } from "react";
import { useEvaluationHistory } from "@/context/main/useEvaluationHistory";
import type { EvaluationData } from "@/database/analytics/types";
import EvaluationItem from "./EvaluationItem";
import ModalEvaluationDetail from "./ModalEvaluationDetail";

const DateDivider = ({ date }: { date: string }) => (
  <div className="flex flex-row items-center gap-4 my-6">
    <div className="flex-1 h-px bg-uGrayLight"></div>

    <span className="text-uGray font-medium text-sm">{date}</span>

    <div className="flex-1 h-px bg-uGrayLight"></div>
  </div>
);

const EvaluationHistoryList = () => {
  const { groupedEvaluations, loading } = useEvaluationHistory();
  const [selectedEvaluation, setSelectedEvaluation] =
    useState<EvaluationData | null>(null);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-uGrayLight">Loading evaluations...</div>
      </div>
    );
  }

  const sortedDates = Object.keys(groupedEvaluations).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-uGrayLight text-lg mb-2">No evaluations found</div>
        <div className="text-uGrayLight/70 text-sm">
          {Object.keys(groupedEvaluations).length === 0
            ? "Start by creating your first evaluation"
            : "Try adjusting your date range filter"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {sortedDates.map((date) => (
        <div key={date}>
          <DateDivider date={date} />
          <div className="space-y-3">
            {groupedEvaluations[date].map((evaluation) => (
              <EvaluationItem
                key={evaluation.id}
                evaluation={evaluation}
                setSelectedEvaluation={() => setSelectedEvaluation(evaluation)}
              />
            ))}
          </div>
        </div>
      ))}
      <ModalEvaluationDetail
        evaluation={selectedEvaluation}
        onClose={() => setSelectedEvaluation(null)}
      />
    </div>
  );
};

export default EvaluationHistoryList;
