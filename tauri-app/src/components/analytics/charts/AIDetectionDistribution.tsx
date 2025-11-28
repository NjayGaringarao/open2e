import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/utils/style";

interface AIDetectionDistributionProps {
  data: Array<{
    overall_score: number;
  }>;
}

export const AIDetectionDistribution: React.FC<
  AIDetectionDistributionProps
> = ({ data }) => {
  // Calculate distribution across score ranges
  const distribution = [
    { range: "0-20%", count: 0, color: "#22c55e" },
    { range: "20-40%", count: 0, color: "#84cc16" },
    { range: "40-60%", count: 0, color: "#eab308" },
    { range: "60-80%", count: 0, color: "#f59e0b" },
    { range: "80-100%", count: 0, color: "#ef4444" },
  ];

  // Count evaluations in each range
  data.forEach((item) => {
    const percentage = Math.round(item.overall_score * 100);
    if (percentage <= 20) {
      distribution[0].count++;
    } else if (percentage <= 40) {
      distribution[1].count++;
    } else if (percentage <= 60) {
      distribution[2].count++;
    } else if (percentage <= 80) {
      distribution[3].count++;
    } else {
      distribution[4].count++;
    }
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-uGrayLight rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-uGray">{label}</p>
          <p className="text-uGrayLight">
            <span className="font-medium">{payload[0].value}</span> evaluations
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={cn(
        "rounded-xl shadow-xl border border-uGrayLight/30 backdrop-blur-sm",
        "bg-gradient-to-br from-background via-background/95 to-background/90",
        "p-6"
      )}
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-uGray mb-2">
          AI Detection Score Distribution
        </h3>
        <p className="text-sm text-uGrayLight">
          Distribution of AI detection scores across all evaluations
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={distribution}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              opacity={0.3}
            />
            <XAxis
              dataKey="range"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
              {distribution.map((entry, index) => (
                <Bar key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="flex items-center gap-4 text-xs text-uGrayLight">
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#22c55e" }}
            ></div>
            <span>Low (0-20%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#84cc16" }}
            ></div>
            <span>Low-Medium (20-40%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#eab308" }}
            ></div>
            <span>Medium (40-60%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#f59e0b" }}
            ></div>
            <span>Medium-High (60-80%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#ef4444" }}
            ></div>
            <span>High (80-100%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
