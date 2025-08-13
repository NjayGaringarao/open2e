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
  colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]
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
          No data available for chart
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ questionContent, percent }) => 
              `${truncateText(questionContent)} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
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
  );
};
