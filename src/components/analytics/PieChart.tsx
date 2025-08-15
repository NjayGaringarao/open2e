import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { QuestionScore } from '@/database/analytics/types';

interface PieChartProps {
  data: QuestionScore[];
  title?: string;
  dataKey?: string;
  colors?: string[];
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title = "Score Distribution",
  dataKey = "totalEvaluations",
  colors = [
    "var(--score-0)",
    "var(--score-1)", 
    "var(--score-2)",
    "var(--score-3)",
    "var(--score-4)",
    "var(--score-5)",
    "var(--score-6)",
    "var(--score-7)",
    "var(--score-8)",
    "var(--score-9)",
    "var(--score-10)"
  ]
}) => {
  const formatTooltip = (value: any, name: string) => {
    const total = data.reduce((sum, item) => sum + (item[dataKey as keyof QuestionScore] as number || 0), 0);
    const percentage = ((value / total) * 100).toFixed(1);
    return [`${value} (${percentage}%)`, name];
  };

  const truncateText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p className="mb-2">No question data available</p>
            <p className="text-sm text-gray-400">Start evaluating answers to see score distribution charts</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-lg shadow-md p-6 border border-uGrayLight">
      <h3 className="text-lg font-semibold text-uGray mb-4">{title}</h3>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ questionContent, percent }) => 
                `${truncateText(questionContent)} ${percent ? (percent * 100).toFixed(0) : 0}%`
              }
              outerRadius={80}
              fill={getComputedStyle(document.documentElement).getPropertyValue('--uBlue').trim()}
              dataKey={dataKey}
              nameKey="questionContent"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Pie>
            <Tooltip formatter={formatTooltip} />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
