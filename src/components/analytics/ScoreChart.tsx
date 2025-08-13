import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import type { EvaluationTimeData } from '@/database/analytics/types';

interface ScoreChartProps {
  data: EvaluationTimeData[];
  title?: string;
  type?: 'line' | 'area';
}

export const ScoreChart: React.FC<ScoreChartProps> = ({
  data,
  title = "Evaluations Over Time",
  type = 'line'
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTooltip = (value: any, name: string) => {
    if (name === 'count') return [`${value} evaluations`, 'Count'];
    if (name === 'averageScore') return [`${value.toFixed(2)}`, 'Average Score'];
    return [value, name];
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available for chart
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {type === 'area' ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={formatDate}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="count"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
              name="Count"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="averageScore"
              stackId="2"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
              name="Average Score"
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={formatDate}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              strokeWidth={2}
              name="Count"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="averageScore"
              stroke="#82ca9d"
              strokeWidth={2}
              name="Average Score"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
