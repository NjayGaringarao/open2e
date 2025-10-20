import React from "react";
import { Rank } from "./Rank";
import type { AnalyticsSummary } from "@/database/analytics/types";

interface RankTabProps {
  analyticsData: AnalyticsSummary;
}

export const RankTab: React.FC<RankTabProps> = ({ analyticsData }) => {
  return (
    <div className="space-y-8">
      <Rank data={analyticsData.averageScorePerQuestion} />
    </div>
  );
};
