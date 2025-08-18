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
      <div className="bg-panel rounded-lg shadow-md p-6 border border-uGrayLight">
        <h3 className="text-lg font-semibold text-uGray mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-uGrayLight">
          <div className="text-center">
            <p className="mb-2">No evaluation data available</p>
            <p className="text-sm text-uGrayLightLight">Start evaluating answers to see trends over time</p>
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
          {type === 'area' ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={getComputedStyle(document.documentElement).getPropertyValue('--uGrayLight').trim()} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12, fill: getComputedStyle(document.documentElement).getPropertyValue('--uGray').trim() }}
              />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: getComputedStyle(document.documentElement).getPropertyValue('--uGray').trim() }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: getComputedStyle(document.documentElement).getPropertyValue('--uGray').trim() }} />
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
                stroke={getComputedStyle(document.documentElement).getPropertyValue('--uBlue').trim()}
                fill={getComputedStyle(document.documentElement).getPropertyValue('--uBlue').trim()}
                fillOpacity={0.6}
                name="Count"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="averageScore"
                stackId="2"
                stroke={getComputedStyle(document.documentElement).getPropertyValue('--uGreen').trim()}
                fill={getComputedStyle(document.documentElement).getPropertyValue('--uGreen').trim()}
                fillOpacity={0.6}
                name="Average Score"
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={getComputedStyle(document.documentElement).getPropertyValue('--uGrayLight').trim()} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12, fill: getComputedStyle(document.documentElement).getPropertyValue('--uGray').trim() }}
              />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: getComputedStyle(document.documentElement).getPropertyValue('--uGray').trim() }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: getComputedStyle(document.documentElement).getPropertyValue('--uGray').trim() }} />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={formatDate}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="count"
                stroke={getComputedStyle(document.documentElement).getPropertyValue('--uBlue').trim()}
                strokeWidth={2}
                name="Count"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="averageScore"
                stroke={getComputedStyle(document.documentElement).getPropertyValue('--uGreen').trim()}
                strokeWidth={2}
                name="Average Score"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
