import React from "react";
import type {
  AnalyticsSummary,
  EvaluationData,
} from "@/database/analytics/types";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Award,
  AlertTriangle,
} from "lucide-react";

interface PerformanceMetricsProps {
  analyticsData: AnalyticsSummary;
  evaluationsData: EvaluationData[];
  className?: string;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  analyticsData,
  evaluationsData,
  className = "",
}) => {
  const calculateMetrics = () => {
    // Convert scores to percentages for consistent comparison
    const percentageScores = evaluationsData.map(
      (e) => (e.score / e.totalScore) * 100
    );
    const sortedScores = [...percentageScores].sort((a, b) => a - b);

    const minScore = Math.min(...percentageScores);
    const maxScore = Math.max(...percentageScores);
    const medianScore = sortedScores[Math.floor(sortedScores.length / 2)];
    const standardDeviation = Math.sqrt(
      percentageScores.reduce(
        (sum, score) =>
          sum + Math.pow(score - analyticsData.overallAverageScore, 2),
        0
      ) / percentageScores.length
    );

    // Use percentage-based thresholds
    const excellentCount = percentageScores.filter((s) => s >= 80).length;
    const goodCount = percentageScores.filter((s) => s >= 60 && s < 80).length;
    const poorCount = percentageScores.filter((s) => s < 60).length;

    const recentEvaluations = evaluationsData.filter(
      (e) =>
        new Date(e.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    const avgScoreLastWeek =
      recentEvaluations > 0
        ? evaluationsData
            .filter(
              (e) =>
                new Date(e.timestamp) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            )
            .reduce((sum, e) => sum + (e.score / e.totalScore) * 100, 0) /
          recentEvaluations
        : 0;

    return {
      minScore: minScore.toFixed(1),
      maxScore: maxScore.toFixed(1),
      medianScore: medianScore.toFixed(1),
      standardDeviation: standardDeviation.toFixed(2),
      excellentCount,
      goodCount,
      poorCount,
      recentEvaluations,
      avgScoreLastWeek: avgScoreLastWeek.toFixed(1),
      totalEvaluations: percentageScores.length,
    };
  };

  const metrics = calculateMetrics();

  const getPerformanceTrend = () => {
    const recentAvg = parseFloat(metrics.avgScoreLastWeek);
    const overallAvg = analyticsData.overallAverageScore;

    if (recentAvg > overallAvg + 0.5)
      return { trend: "up", color: "text-uGreen", icon: TrendingUp };
    if (recentAvg < overallAvg - 0.5)
      return { trend: "down", color: "text-uRed", icon: TrendingDown };
    return { trend: "stable", color: "text-primary", icon: Target };
  };

  const performanceTrend = getPerformanceTrend();

  return (
    <div
      className={`bg-panel rounded-lg shadow-md p-6 border border-uGrayLight ${className}`}
    >
      <h3 className="text-lg font-semibold text-uGray mb-4">
        Performance Metrics
      </h3>

      {/* Performance Trend */}
      <div className="mb-6 p-4 bg-panel rounded-lg border border-uGrayLight">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-uGrayLight">
              Performance Trend
            </h4>
            <p className={`text-lg font-bold ${performanceTrend.color}`}>
              {performanceTrend.trend === "up"
                ? "Improving"
                : performanceTrend.trend === "down"
                ? "Declining"
                : "Stable"}
            </p>
          </div>
          <performanceTrend.icon
            className={`h-8 w-8 ${performanceTrend.color}`}
          />
        </div>
        <p className="text-sm text-uGrayLight mt-2">
          Recent average: {metrics.avgScoreLastWeek}% vs Overall:{" "}
          {analyticsData.overallAverageScore.toFixed(1)}%
        </p>
      </div>

      {/* Statistical Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-panel rounded-lg border border-uGrayLight">
          <Target className="h-6 w-6 text-uBlue mx-auto mb-2" />
          <p className="text-sm text-uGrayLight">Min Score</p>
          <p className="text-lg font-bold text-uBlue">{metrics.minScore}%</p>
        </div>
        <div className="text-center p-3 bg-panel rounded-lg border border-uGrayLight">
          <Award className="h-6 w-6 text-uGreen mx-auto mb-2" />
          <p className="text-sm text-uGrayLight">Max Score</p>
          <p className="text-lg font-bold text-uGreen">{metrics.maxScore}%</p>
        </div>
        <div className="text-center p-3 bg-panel rounded-lg border border-uGrayLight">
          <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-sm text-uGrayLight">Median</p>
          <p className="text-lg font-bold text-primary">
            {metrics.medianScore}%
          </p>
        </div>
        <div className="text-center p-3 bg-panel rounded-lg border border-uGrayLight">
          <AlertTriangle className="h-6 w-6 text-uRed mx-auto mb-2" />
          <p className="text-sm text-uGrayLight">Std Dev</p>
          <p className="text-lg font-bold text-uRed">
            {metrics.standardDeviation}
          </p>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-uGray mb-3">
          Score Distribution
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-uGrayLight">Excellent (80%+)</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-uGrayLightLight rounded-full h-2">
                <div
                  className="bg-uGreen h-2 rounded-full"
                  style={{
                    width: `${
                      (metrics.excellentCount / metrics.totalEvaluations) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-sm font-medium">
                {metrics.excellentCount}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-uGrayLight">Good (60-79%)</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-uGrayLightLight rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${
                      (metrics.goodCount / metrics.totalEvaluations) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-sm font-medium">{metrics.goodCount}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-uGrayLight">Poor (&lt;60%)</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-uGrayLightLight rounded-full h-2">
                <div
                  className="bg-uRed h-2 rounded-full"
                  style={{
                    width: `${
                      (metrics.poorCount / metrics.totalEvaluations) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-sm font-medium">{metrics.poorCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h4 className="text-md font-semibold text-uGray mb-3">
          Recent Activity
        </h4>
        <div className="flex items-center space-x-2 text-sm text-uGrayLight">
          <Clock className="h-4 w-4" />
          <span>
            {metrics.recentEvaluations} evaluations in the last 7 days
          </span>
        </div>
      </div>
    </div>
  );
};
