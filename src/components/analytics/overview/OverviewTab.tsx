import React, { useState } from "react";
import { AnalyticsCard } from "./AnalyticsCard";
import { ScoreChart } from "./ScoreChart";
import { QuestionScoresTable } from "./QuestionScoresTable";
import { EvaluationsTable } from "./EvaluationsTable";
import { cn } from "@/utils/style";
import type {
  AnalyticsSummary,
  EvaluationData,
} from "@/database/analytics/types";
import { BarChart3, TrendingUp, Users, Award } from "lucide-react";

interface OverviewTabProps {
  analyticsData: AnalyticsSummary;
  evaluationsData: EvaluationData[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  analyticsData,
  evaluationsData,
}) => {
  const [chartType, setChartType] = useState<"line" | "area">("line");

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <AnalyticsCard
          title="Total Answers Evaluated"
          value={analyticsData.totalAnswers}
          icon={<BarChart3 className="h-8 w-8 text-uBlue" />}
        />
        <AnalyticsCard
          title="Overall Average Score"
          value={analyticsData.overallAverageScore.toFixed(2)}
          subtitle="out of 10"
          icon={<TrendingUp className="h-8 w-8 text-uGreen" />}
        />
        <AnalyticsCard
          title="Questions Evaluated"
          value={analyticsData.averageScorePerQuestion.length}
          icon={<Users className="h-8 w-8 text-uGray" />}
        />
        <AnalyticsCard
          title="Best Performing Question"
          value={
            analyticsData.averageScorePerQuestion.length > 0
              ? Math.max(
                  ...analyticsData.averageScorePerQuestion.map(
                    (q) => q.averageScore || 0
                  )
                ).toFixed(2)
              : "N/A"
          }
          subtitle="average score"
          icon={<Award className="h-8 w-8 text-primary" />}
        />
      </div>

      {/* Main Chart */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-uGray">
            Evaluations Over Time
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType("line")}
              className={cn(
                "px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300",
                chartType === "line"
                  ? "bg-gradient-to-r from-uBlue to-blue-600 text-background shadow-lg"
                  : "bg-gradient-to-r from-uGrayLight to-uGrayLightLight text-uGray hover:from-uGrayLightLight hover:to-uGrayLight"
              )}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType("area")}
              className={cn(
                "px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300",
                chartType === "area"
                  ? "bg-gradient-to-r from-uBlue to-blue-600 text-background shadow-lg"
                  : "bg-gradient-to-r from-uGrayLight to-uGrayLightLight text-uGray hover:from-uGrayLightLight hover:to-uGrayLight"
              )}
            >
              Area Chart
            </button>
          </div>
        </div>
        <div
          className={cn(
            "rounded-xl shadow-xl border border-uGrayLight/30 backdrop-blur-sm",
            "bg-gradient-to-br from-background via-background/95 to-background/90"
          )}
        >
          <ScoreChart
            data={analyticsData.evaluationsOverTime}
            type={chartType}
          />
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuestionScoresTable data={analyticsData.averageScorePerQuestion} />
        <EvaluationsTable data={evaluationsData} maxRows={5} />
      </div>
    </>
  );
};
