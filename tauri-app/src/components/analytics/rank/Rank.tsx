import React from "react";
import type { QuestionScore } from "@/database/analytics/types";

interface RankProps {
  data: QuestionScore[];
  className?: string;
}

export const Rank: React.FC<RankProps> = ({ data, className = "" }) => {
  const sortedByScore = [...data].sort(
    (a, b) => b.averageScore - a.averageScore
  );
  const sortedByEvaluations = [...data].sort(
    (a, b) => b.totalEvaluations - a.totalEvaluations
  );

  return (
    <div
      className={`bg-gradient-to-br from-background via-background/95 to-background/90 rounded-xl shadow-xl p-6 border border-uGrayLight/30 backdrop-blur-sm ${className}`}
    >
      <h3 className="text-xl font-semibold text-uGray mb-6">Rank</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-uGrayLight mb-3">
            Top by Average Score
          </h4>
          <ol className="space-y-2">
            {sortedByScore.slice(0, 10).map((q, idx) => (
              <li
                key={`score-${q.questionId}`}
                className="flex items-start justify-between p-3 rounded-lg border border-uGrayLight/30"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-uBlue/10 text-uBlue text-xs font-semibold">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm text-uGray line-clamp-2">
                      {q.questionContent}
                    </p>
                    <p className="text-xs text-uGrayLight">
                      Evaluations: {q.totalEvaluations}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-uGreen">
                  {q.averageScore.toFixed(2)}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h4 className="text-sm font-medium text-uGrayLight mb-3">
            Top by Total Evaluations
          </h4>
          <ol className="space-y-2">
            {sortedByEvaluations.slice(0, 10).map((q, idx) => (
              <li
                key={`eval-${q.questionId}`}
                className="flex items-start justify-between p-3 rounded-lg border border-uGrayLight/30"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm text-uGray line-clamp-2">
                      {q.questionContent}
                    </p>
                    <p className="text-xs text-uGrayLight">
                      Avg score: {q.averageScore.toFixed(2)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {q.totalEvaluations}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
