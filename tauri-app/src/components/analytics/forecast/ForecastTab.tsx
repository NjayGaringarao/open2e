import React from "react";
import { Forecast } from "./Forecast";
import type { AnalyticsSummary } from "@/database/analytics/types";

interface ForecastTabProps {
  analyticsData: AnalyticsSummary;
}

export const ForecastTab: React.FC<ForecastTabProps> = ({ analyticsData }) => {
  return (
    <div className="space-y-8">
      <Forecast data={analyticsData.evaluationsOverTime} />
    </div>
  );
};
