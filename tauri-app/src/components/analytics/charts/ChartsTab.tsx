import React from "react";
import { BarChart } from "./BarChart";
import { PieChart } from "./PieChart";
import { AIDetectionDistribution } from "./AIDetectionDistribution";
import { AIDetectionPieChart } from "./AIDetectionPieChart";
import { cn } from "@/utils/style";
import type { AnalyticsSummary } from "@/database/analytics/types";
import type { EvaluationData } from "@/database/analytics/types";
import EvaluationOvertime from "./EvaluationOvertime";

interface ChartsTabProps {
  analyticsData: AnalyticsSummary;
  evaluationsData: EvaluationData[];
}

export const ChartsTab: React.FC<ChartsTabProps> = ({
  analyticsData,
  evaluationsData,
}) => {
  // Filter evaluations with AI detection data
  const aiDetectionData = evaluationsData
    .filter((evaluation) => evaluation.aiDetectionData)
    .map((evaluation) => ({
      overall_score: evaluation.aiDetectionData!.overall_score,
    }));

  return (
    <div className="space-y-8">
      {/* Question Performance Charts */}
      <div>
        <h3 className="text-xl font-semibold text-uGray mb-6">
          Question Performance
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            className={cn(
              "rounded-xl shadow-xl border border-uGrayLight/30 backdrop-blur-sm",
              "bg-gradient-to-br from-background via-background/95 to-background/90"
            )}
          >
            <BarChart
              data={analyticsData.averageScorePerQuestion}
              title="Question Performance (Bar Chart)"
              dataKey="averageScore"
            />
          </div>
          <div
            className={cn(
              "rounded-xl shadow-xl border border-uGrayLight/30 backdrop-blur-sm",
              "bg-gradient-to-br from-background via-background/95 to-background/90"
            )}
          >
            <PieChart
              data={analyticsData.averageScorePerQuestion}
              title="Score Distribution (Pie Chart)"
              dataKey="totalEvaluations"
            />
          </div>
        </div>
      </div>

      <EvaluationOvertime analyticsData={analyticsData} />

      {/* AI Detection Analytics */}
      {aiDetectionData.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-uGray mb-6">
            AI Detection Analytics
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AIDetectionDistribution data={aiDetectionData} />
            <AIDetectionPieChart
              data={{
                highRiskCount: analyticsData.aiDetectionMetrics.highRiskCount,
                mediumRiskCount:
                  analyticsData.aiDetectionMetrics.mediumRiskCount,
                lowRiskCount: analyticsData.aiDetectionMetrics.lowRiskCount,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
