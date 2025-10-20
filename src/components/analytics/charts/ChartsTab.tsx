import React from "react";
import { BarChart } from "./BarChart";
import { PieChart } from "./PieChart";
import { cn } from "@/utils/style";
import type { AnalyticsSummary } from "@/database/analytics/types";

interface ChartsTabProps {
  analyticsData: AnalyticsSummary;
}

export const ChartsTab: React.FC<ChartsTabProps> = ({ analyticsData }) => {
  return (
    <div className="space-y-8">
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
  );
};
