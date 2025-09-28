import React, { useMemo } from "react";
import type { EvaluationTimeData } from "@/database/analytics/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ForecastingProps {
  data: EvaluationTimeData[];
  className?: string;
}

// Simple linear regression y = a + b x
function computeLinearRegression(points: { x: number; y: number }[]) {
  const n = points.length;
  if (n === 0) return { a: 0, b: 0 };
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return { a: sumY / n, b: 0 };
  const b = (n * sumXY - sumX * sumY) / denom;
  const a = sumY / n - (b * sumX) / n;
  return { a, b };
}

export const Forecasting: React.FC<ForecastingProps> = ({ data, className = "" }) => {
  const series = useMemo(() => {
    const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const base = sorted.map((d, i) => ({ x: i, y: d.averageScore, date: d.date }));
    const { a, b } = computeLinearRegression(base);
    const forecastHorizon = 7; // forecast next 7 points
    const lastIndex = base.length - 1;

    const regression = base.map(p => ({ date: p.date, averageScore: p.y, trend: a + b * p.x }));
    const forecast = Array.from({ length: Math.max(0, forecastHorizon) }).map((_, k) => {
      const x = lastIndex + 1 + k;
      const y = a + b * x;
      const nextDate = new Date(sorted[sorted.length - 1]?.date || Date.now());
      nextDate.setDate(nextDate.getDate() + (k + 1));
      return { date: nextDate.toISOString(), averageScore: null as any, trend: y, isForecast: true };
    });

    return [...regression, ...forecast];
  }, [data]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={`bg-gradient-to-br from-background via-background/95 to-background/90 rounded-xl shadow-xl p-6 border border-uGrayLight/30 backdrop-blur-sm ${className}`}>
      <h3 className="text-xl font-semibold text-uGray mb-6">Forecasting</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="p-4 rounded-lg border border-uGrayLight/30">
          <p className="text-sm text-uGrayLight">Trend direction</p>
          <p className="text-lg font-semibold text-primary">
            {series.length >= 2 && series[series.length - 1].trend > series[0].trend ? "Upward" : "Downward"}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-uGrayLight/30">
          <p className="text-sm text-uGrayLight">Next expected score</p>
          <p className="text-lg font-semibold text-uBlue">
            {series.length ? (series[series.length - 1].trend as number).toFixed(2) : "-"}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-uGrayLight/30">
          <p className="text-sm text-uGrayLight">Forecast horizon</p>
          <p className="text-lg font-semibold text-uGray">7 points</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 3" stroke={getComputedStyle(document.documentElement).getPropertyValue("--uGrayLight").trim()} />
          <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12, fill: getComputedStyle(document.documentElement).getPropertyValue("--uGray").trim() }} />
          <YAxis tick={{ fontSize: 12, fill: getComputedStyle(document.documentElement).getPropertyValue("--uGray").trim() }} />
          <Tooltip labelFormatter={formatDate} />
          <Line type="monotone" dataKey="averageScore" name="Actual" stroke={getComputedStyle(document.documentElement).getPropertyValue("--uBlue").trim()} dot={false} connectNulls={false} />
          <Line type="monotone" dataKey="trend" name="Trend & Forecast" stroke={getComputedStyle(document.documentElement).getPropertyValue("--primary").trim()} strokeDasharray="5 5" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};


