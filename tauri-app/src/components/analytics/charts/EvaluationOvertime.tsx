import { cn } from "@/utils/style";
import { useState } from "react";
import { ScoreChart } from "./ScoreChart";
import { AnalyticsSummary } from "@/database/analytics/types";

interface EvaluationOvertimeProps {
  analyticsData: AnalyticsSummary;
}

const EvaluationOvertime = ({ analyticsData }: EvaluationOvertimeProps) => {
  const [chartType, setChartType] = useState<"line" | "area">("line");
  return (
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
        <ScoreChart data={analyticsData.evaluationsOverTime} type={chartType} />
      </div>
    </div>
  );
};

export default EvaluationOvertime;
