import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { QuestionScore } from '@/database/analytics/types';

interface BarChartProps {
  data: QuestionScore[];
  title?: string;
  dataKey?: string;
  color?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title = "Question Performance",
  dataKey = "averageScore",
  color = "#8884d8"
}) => {
  const formatTooltip = (value: any, name: string) => {
    if (name === 'averageScore') return [`${value.toFixed(2)}`, 'Average Score'];
    if (name === 'totalEvaluations') return [`${value}`, 'Total Evaluations'];
    return [value, name];
  };

  const truncateText = (text: string, maxLength: number = 30) => {
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
            <p className="text-sm text-gray-400">Start evaluating answers to see question performance charts</p>
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
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={getComputedStyle(document.documentElement).getPropertyValue('--uGrayLight').trim()} />
            <XAxis 
              dataKey="questionContent" 
              tickFormatter={truncateText}
              tick={{ fontSize: 12, fill: getComputedStyle(document.documentElement).getPropertyValue('--uGray').trim() }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12, fill: getComputedStyle(document.documentElement).getPropertyValue('--uGray').trim() }} />
            <Tooltip formatter={formatTooltip} />
            <Legend />
            <Bar 
              dataKey={dataKey} 
              fill={getComputedStyle(document.documentElement).getPropertyValue('--uBlue').trim()}
              radius={[4, 4, 0, 0]}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
