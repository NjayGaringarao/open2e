import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
} from 'recharts';
import type { EvaluationTimeData, QuestionScore } from '@/database/analytics/types';
import { Calendar, TrendingUp, BarChart3 } from 'lucide-react';

interface ComparativeAnalysisProps {
  evaluationsOverTime: EvaluationTimeData[];
  questionScores: QuestionScore[];
  className?: string;
}

export const ComparativeAnalysis: React.FC<ComparativeAnalysisProps> = ({
  evaluationsOverTime,
  questionScores,
  className = "",
}) => {
  const [comparisonType, setComparisonType] = useState<'time' | 'questions'>('time');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  const getTimeComparisonData = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filteredData = evaluationsOverTime.filter(item => 
      new Date(item.date) >= startDate
    );

    // Split data into two periods for comparison
    const midPoint = Math.floor(filteredData.length / 2);
    const period1 = filteredData.slice(0, midPoint);
    const period2 = filteredData.slice(midPoint);

    const period1Avg = period1.length > 0 
      ? period1.reduce((sum, item) => sum + item.averageScore, 0) / period1.length 
      : 0;
    const period2Avg = period2.length > 0 
      ? period2.reduce((sum, item) => sum + item.averageScore, 0) / period2.length 
      : 0;

    return {
      period1: period1.map(item => ({ ...item, period: 'Period 1' })),
      period2: period2.map(item => ({ ...item, period: 'Period 2' })),
      period1Avg: period1Avg.toFixed(2),
      period2Avg: period2Avg.toFixed(2),
      improvement: ((period2Avg - period1Avg) / period1Avg * 100).toFixed(1)
    };
  };

  const getQuestionComparisonData = () => {
    const sortedQuestions = [...questionScores].sort((a, b) => b.averageScore - a.averageScore);
    const topQuestions = sortedQuestions.slice(0, 5);
    const bottomQuestions = sortedQuestions.slice(-5).reverse();

    return {
      topQuestions: topQuestions.map(q => ({ ...q, category: 'Top Performers' })),
      bottomQuestions: bottomQuestions.map(q => ({ ...q, category: 'Needs Improvement' })),
      topAvg: (topQuestions.reduce((sum, q) => sum + q.averageScore, 0) / topQuestions.length).toFixed(2),
      bottomAvg: (bottomQuestions.reduce((sum, q) => sum + q.averageScore, 0) / bottomQuestions.length).toFixed(2)
    };
  };

  const timeData = getTimeComparisonData();
  const questionData = getQuestionComparisonData();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTooltip = (value: any, name: string) => {
    if (name === 'averageScore') return [`${value.toFixed(2)}`, 'Average Score'];
    if (name === 'count') return [`${value}`, 'Count'];
    return [value, name];
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Comparative Analysis</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setComparisonType('time')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              comparisonType === 'time'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-1" />
            Time
          </button>
          <button
            onClick={() => setComparisonType('questions')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              comparisonType === 'questions'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-1" />
            Questions
          </button>
        </div>
      </div>

      {comparisonType === 'time' && (
        <div>
          {/* Time Range Selector */}
          <div className="mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  timeRange === 'week'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  timeRange === 'month'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange('quarter')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  timeRange === 'quarter'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Quarter
              </button>
            </div>
          </div>

          {/* Comparison Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Period 1 Average</p>
              <p className="text-2xl font-bold text-blue-600">{timeData.period1Avg}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Period 2 Average</p>
              <p className="text-2xl font-bold text-green-600">{timeData.period2Avg}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Improvement</p>
              <p className={`text-2xl font-bold ${parseFloat(timeData.improvement) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(timeData.improvement) >= 0 ? '+' : ''}{timeData.improvement}%
              </p>
            </div>
          </div>

          {/* Time Comparison Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[...timeData.period1, ...timeData.period2]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={formatDate}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="averageScore"
                stroke="#8884d8"
                strokeWidth={2}
                name="Period 1"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="averageScore"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Period 2"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {comparisonType === 'questions' && (
        <div>
          {/* Question Comparison Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Top Performers Average</p>
              <p className="text-2xl font-bold text-green-600">{questionData.topAvg}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Needs Improvement Average</p>
              <p className="text-2xl font-bold text-red-600">{questionData.bottomAvg}</p>
            </div>
          </div>

          {/* Question Comparison Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={[...questionData.topQuestions, ...questionData.bottomQuestions]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="questionContent" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={formatTooltip} />
              <Legend />
              <Bar 
                dataKey="averageScore" 
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
