import React, { useState } from "react";
import { AnalyticsCard } from "./AnalyticsCard";
import { ScoreChart } from "./ScoreChart";
import { QuestionScoresTable } from "./QuestionScoresTable";
import { EvaluationsTable } from "./EvaluationsTable";
import { BarChart } from "./BarChart";
import { PieChart } from "./PieChart";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Ranking } from "./Ranking";
import { Forecasting } from "./Forecasting";
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  RefreshCcwIcon,
} from "lucide-react";

export const AnalyticsDashboard: React.FC = () => {
  const { analyticsData, evaluationsData, loading, refreshData } =
    useAnalytics();
  const [chartType, setChartType] = useState<"line" | "area">("line");
  const [activeTab, setActiveTab] = useState<
    "overview" | "charts" | "ranking" | "forecasting"
  >("overview");

  if (loading) {
    return (
      <div className="flex flex-col w-full h-full p-6 overflow-y-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-uBlue/20 mx-auto mb-6"></div>
              <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-uBlue mx-auto"></div>
            </div>
            <p className="text-uGrayLight text-lg">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  // Remove error state - just show empty state instead
  // Check if there's any data to show
  const hasData =
    analyticsData &&
    (analyticsData.totalAnswers > 0 ||
      analyticsData.averageScorePerQuestion.length > 0 ||
      analyticsData.evaluationsOverTime.length > 0);

  // Show empty state if no data
  if (!hasData) {
    return (
      <div className="flex flex-col flex-1 w-full h-full items-center justify-center">
        {/* Empty State - Enhanced with more content */}

        <div className="relative w-full max-w-5xl bg-gradient-to-br from-background via-background/95 to-background/90 rounded-2xl shadow-2xl p-16 border border-uGrayLight/30 text-center backdrop-blur-sm">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 rounded-2xl" />
          <div className="relative z-10">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-uBlue via-primary to-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-2xl">
              <BarChart3 className="h-16 w-16 text-white" />
            </div>

            <p className="text-lg text-uGrayLight mb-8 max-w-lg mx-auto leading-relaxed">
              Start evaluating answers in the evaluation page to see
              comprehensive analytics data here. The dashboard will display
              detailed insights about your evaluation performance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-blue-700/10 rounded-xl p-6 border border-blue-500/20">
                <h4 className="font-semibold text-uGray mb-3 flex items-center">
                  <span className="text-2xl mr-2">📊</span>
                  Key Metrics
                </h4>
                <ul className="text-base text-uGrayLight space-y-2">
                  <li>• Total answers evaluated</li>
                  <li>• Overall average score</li>
                  <li>• Performance trends</li>
                  <li>• Question-wise analysis</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-emerald-700/10 rounded-xl p-6 border border-emerald-500/20">
                <h4 className="font-semibold text-uGray mb-3 flex items-center">
                  <span className="text-2xl mr-2">📈</span>
                  Visual Insights
                </h4>
                <ul className="text-base text-uGrayLight space-y-2">
                  <li>• Interactive charts</li>
                  <li>• Score distributions</li>
                  <li>• Time-based analysis</li>
                  <li>• Comparative data</li>
                </ul>
              </div>
            </div>
          </div>
          <button
            onClick={refreshData}
            className="absolute flex flex-row gap-2 top-4 right-4 text-uGrayLight hover:text-primary"
          >
            Load Data <RefreshCcwIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <h2 className="text-3xl font-bold text-primary bg-clip-text">
            Dashboard
          </h2>
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-lg blur opacity-50" />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-gradient-to-r from-uBlue to-blue-600 text-background rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-uGrayLight/30 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
              activeTab === "overview"
                ? "border-primary text-primary"
                : "border-transparent text-uGrayLight hover:text-uGray hover:border-uGrayLight"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("charts")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
              activeTab === "charts"
                ? "border-primary text-primary"
                : "border-transparent text-uGrayLight hover:text-uGray hover:border-uGrayLight"
            }`}
          >
            Charts
          </button>
          <button
            onClick={() => setActiveTab("ranking")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
              activeTab === "ranking"
                ? "border-primary text-primary"
                : "border-transparent text-uGrayLight hover:text-uGray hover:border-uGrayLight"
            }`}
          >
            Ranking
          </button>
          <button
            onClick={() => setActiveTab("forecasting")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
              activeTab === "forecasting"
                ? "border-primary text-primary"
                : "border-transparent text-uGrayLight hover:text-uGray hover:border-uGrayLight"
            }`}
          >
            Forecasting
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
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
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                    chartType === "line"
                      ? "bg-gradient-to-r from-uBlue to-blue-600 text-background shadow-lg"
                      : "bg-gradient-to-r from-uGrayLight to-uGrayLightLight text-uGray hover:from-uGrayLightLight hover:to-uGrayLight"
                  }`}
                >
                  Line Chart
                </button>
                <button
                  onClick={() => setChartType("area")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                    chartType === "area"
                      ? "bg-gradient-to-r from-uBlue to-blue-600 text-background shadow-lg"
                      : "bg-gradient-to-r from-uGrayLight to-uGrayLightLight text-uGray hover:from-uGrayLightLight hover:to-uGrayLight"
                  }`}
                >
                  Area Chart
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-background via-background/95 to-background/90 rounded-xl shadow-xl p-6 border border-uGrayLight/30 backdrop-blur-sm">
              <ScoreChart
                data={analyticsData.evaluationsOverTime}
                type={chartType}
              />
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-background via-background/95 to-background/90 rounded-xl shadow-xl border border-uGrayLight/30 backdrop-blur-sm">
              <QuestionScoresTable
                data={analyticsData.averageScorePerQuestion}
              />
            </div>
            <div className="bg-gradient-to-br from-background via-background/95 to-background/90 rounded-xl shadow-xl border border-uGrayLight/30 backdrop-blur-sm">
              <EvaluationsTable data={evaluationsData} maxRows={5} />
            </div>
          </div>
        </>
      )}

      {activeTab === "charts" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-background via-background/95 to-background/90 rounded-xl shadow-xl p-6 border border-uGrayLight/30 backdrop-blur-sm">
              <BarChart
                data={analyticsData.averageScorePerQuestion}
                title="Question Performance (Bar Chart)"
                dataKey="averageScore"
              />
            </div>
            <div className="bg-gradient-to-br from-background via-background/95 to-background/90 rounded-xl shadow-xl p-6 border border-uGrayLight/30 backdrop-blur-sm">
              <PieChart
                data={analyticsData.averageScorePerQuestion}
                title="Score Distribution (Pie Chart)"
                dataKey="totalEvaluations"
              />
            </div>
          </div>
        </div>
      )}
      {activeTab === "ranking" && (
        <div className="space-y-8">
          <Ranking data={analyticsData.averageScorePerQuestion} />
        </div>
      )}
      {activeTab === "forecasting" && (
        <div className="space-y-8">
          <Forecasting data={analyticsData.evaluationsOverTime} />
        </div>
      )}
    </div>
  );
};
