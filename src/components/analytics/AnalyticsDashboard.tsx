import React, { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { cn } from "@/utils/style";
import { LoadingAnalyticsState } from "./LoadingAnalyticsState";
import { EmptyAnalyticsState } from "./EmptyAnalyticsState";
import { TabNavigation, type TabType } from "./TabNavigation";
import { OverviewTab } from "./overview/OverviewTab";
import { ChartsTab } from "./charts/ChartsTab";
import { RankTab } from "./rank/RankTab";
import { ForecastTab } from "./forecast/ForecastTab";

export const AnalyticsDashboard: React.FC = () => {
  const { analyticsData, evaluationsData, loading, refreshData } =
    useAnalytics();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  if (loading) {
    return <LoadingAnalyticsState />;
  }

  // Check if there's any data to show
  const hasData =
    analyticsData &&
    (analyticsData.totalAnswers > 0 ||
      analyticsData.averageScorePerQuestion.length > 0 ||
      analyticsData.evaluationsOverTime.length > 0);

  // Show empty state if no data
  if (!hasData) {
    return <EmptyAnalyticsState onRefresh={refreshData} />;
  }

  return (
    <div className="flex flex-col w-full h-full p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <h2 className="text-3xl font-bold text-primary bg-clip-text">
            Dashboard
          </h2>
          <div
            className={cn(
              "absolute -inset-1",
              "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20",
              "rounded-lg blur opacity-50"
            )}
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={refreshData}
            className={cn(
              "px-4 py-2 rounded-lg",
              "bg-gradient-to-r from-uBlue to-blue-600 text-background",
              "hover:from-blue-600 hover:to-blue-700",
              "transition-all duration-300 shadow-lg hover:shadow-xl"
            )}
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab
          analyticsData={analyticsData}
          evaluationsData={evaluationsData}
        />
      )}

      {activeTab === "charts" && <ChartsTab analyticsData={analyticsData} />}

      {activeTab === "rank" && <RankTab analyticsData={analyticsData} />}

      {activeTab === "forecast" && (
        <ForecastTab analyticsData={analyticsData} />
      )}
    </div>
  );
};
