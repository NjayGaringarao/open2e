import { AnalyticsCard } from "./AnalyticsCard";
import { QuestionScoresTable } from "./QuestionScoresTable";
import { EvaluationsTable } from "./EvaluationsTable";

import type {
  AnalyticsSummary,
  EvaluationData,
} from "@/database/analytics/types";
import {
  BarChart3,
  TrendingUp,
  Activity,
  AlertTriangle,
  CircleQuestionMark,
} from "lucide-react";

interface OverviewTabProps {
  analyticsData: AnalyticsSummary;
  evaluationsData: EvaluationData[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  analyticsData,
  evaluationsData,
}) => {
  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <AnalyticsCard
          title="Answered Question"
          value={analyticsData.averageScorePerQuestion.length}
          icon={<CircleQuestionMark className="h-8 w-8 text-uGray" />}
        />
        <AnalyticsCard
          title="Evaluated Answer"
          value={analyticsData.totalAnswers}
          icon={<BarChart3 className="h-8 w-8 text-uBlue" />}
        />
        <AnalyticsCard
          title="Overall Average Score"
          value={`${Math.round(analyticsData.overallAverageScore)}%`}
          icon={<TrendingUp className="h-8 w-8 text-uGreen" />}
        />
      </div>

      {/* AI Detection Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <AnalyticsCard
          title="Average AI Detection Score"
          value={`${Math.round(
            analyticsData.aiDetectionMetrics.averageAIScore * 100
          )}%`}
          subtitle={`${analyticsData.aiDetectionMetrics.totalWithAIDetection}/${analyticsData.totalAnswers} evaluations`}
          icon={<Activity className="h-8 w-8 text-orange-500" />}
        />
        <AnalyticsCard
          title="High-Risk Evaluations"
          value={`${
            analyticsData.aiDetectionMetrics.totalWithAIDetection > 0
              ? Math.round(
                  (analyticsData.aiDetectionMetrics.highRiskCount /
                    analyticsData.aiDetectionMetrics.totalWithAIDetection) *
                    100
                )
              : 0
          }%`}
          subtitle={`${analyticsData.aiDetectionMetrics.highRiskCount} of ${analyticsData.aiDetectionMetrics.totalWithAIDetection} with AI detection`}
          icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
        />
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuestionScoresTable data={analyticsData.averageScorePerQuestion} />
        <EvaluationsTable data={evaluationsData} maxRows={5} />
      </div>
    </>
  );
};
