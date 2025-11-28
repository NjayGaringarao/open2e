import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/utils/style";

interface AIDetectionPieChartProps {
  data: {
    highRiskCount: number;
    mediumRiskCount: number;
    lowRiskCount: number;
  };
}

export const AIDetectionPieChart: React.FC<AIDetectionPieChartProps> = ({
  data,
}) => {
  const pieData = [
    {
      name: "High Risk (85%+)",
      value: data.highRiskCount,
      color: "#ef4444",
      description: "High probability of AI generation",
    },
    {
      name: "Medium Risk (60-84%)",
      value: data.mediumRiskCount,
      color: "#f59e0b",
      description: "Medium probability of AI generation",
    },
    {
      name: "Low Risk (<60%)",
      value: data.lowRiskCount,
      color: "#22c55e",
      description: "Low probability of AI generation",
    },
  ];

  const total = pieData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage =
        total > 0 ? ((data.value / total) * 100).toFixed(1) : "0";

      return (
        <div className="bg-background border border-uGrayLight rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-uGray">{data.name}</p>
          <p className="text-uGrayLight">
            <span className="font-medium">{data.value}</span> evaluations (
            {percentage}%)
          </p>
          <p className="text-xs text-uGrayLight mt-1">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry: any) => {
    const percentage =
      total > 0 ? ((entry.value / total) * 100).toFixed(0) : "0";
    return `${percentage}%`;
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
          AI Detection Risk Distribution
        </h3>
        <p className="text-sm text-uGrayLight">
          Breakdown of evaluations by AI detection risk level
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="flex flex-col gap-2 text-xs">
          {pieData.map((item, index) => {
            const percentage =
              total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
            return (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-uGrayLight">
                  {item.name}: {item.value} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
