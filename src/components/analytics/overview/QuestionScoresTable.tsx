import React from "react";
import type { QuestionScore } from "@/database/analytics/types";

interface QuestionScoresTableProps {
  data: QuestionScore[];
  title?: string;
}

export const QuestionScoresTable: React.FC<QuestionScoresTableProps> = ({
  data,
  title = "Average Scores by Question",
}) => {
  if (data.length === 0) {
    return (
      <div className="bg-background rounded-lg shadow-md p-6 border border-uGrayLight">
        <h3 className="text-lg font-semibold text-uGray mb-4">{title}</h3>
        <div className="flex items-center justify-center h-32 text-uGrayLight">
          <div className="text-center">
            <p className="mb-2">No questions evaluated yet</p>
            <p className="text-sm text-uGrayLightLight">
              Start evaluating answers to see question performance data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-lg shadow-md p-6 border border-uGrayLight h-[30rem] flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-uGray">{title}</h3>
      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="min-w-full divide-y divide-uGrayLight">
          <thead className="bg-panel">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-uGray uppercase tracking-wider">
                Question ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-uGray uppercase tracking-wider">
                Question Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-uGray uppercase tracking-wider">
                Average Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-uGray uppercase tracking-wider">
                Total Evaluations
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-uGrayLight">
            {data.map((question, index) => (
              <tr key={question.questionId || index} className="hover:bg-panel">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-uGray">
                  {question.questionId}
                </td>
                <td className="px-6 py-4 text-sm text-uGray max-w-xs truncate">
                  {question.questionContent}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-uGray">
                  <span
                    className={`font-semibold ${
                      question.averageScore >= 80
                        ? "text-uGreen"
                        : question.averageScore >= 60
                        ? "text-primary"
                        : "text-uRed"
                    }`}
                  >
                    {question.averageScore
                      ? question.averageScore.toFixed(1) + "%"
                      : "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-uGray">
                  {question.totalEvaluations}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
