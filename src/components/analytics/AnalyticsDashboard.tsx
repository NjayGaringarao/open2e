import React, { useState } from 'react';
import { AnalyticsCard } from './AnalyticsCard';
import { ScoreChart } from './ScoreChart';
import { QuestionScoresTable } from './QuestionScoresTable';
import { EvaluationsTable } from './EvaluationsTable';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { useAnalytics } from '@/hooks/useAnalytics';
import { BarChart3, TrendingUp, Users, Award, Trash2 } from 'lucide-react';
import { clearExistingData } from '@/database/analytics/queries';

export const AnalyticsDashboard: React.FC = () => {
  const { analyticsData, evaluationsData, loading, error, refreshData } = useAnalytics();
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  const [activeTab, setActiveTab] = useState<'overview' | 'charts'>('overview');
  const [isClearing, setIsClearing] = useState(false);

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all existing evaluation data? This action cannot be undone.')) {
      setIsClearing(true);
      try {
        const { error } = await clearExistingData();
        if (error) {
          alert('Failed to clear data: ' + error);
        } else {
          // Refresh data to show empty state
          await refreshData();
        }
      } catch (err) {
        alert('Failed to clear data: ' + err);
      } finally {
        setIsClearing(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full h-full p-6 overflow-y-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uBlue mx-auto mb-4"></div>
            <p className="text-uGrayLight">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  // Remove error state - just show empty state instead
  // Check if there's any data to show
  const hasData = analyticsData && (
    analyticsData.totalAnswers > 0 || 
    analyticsData.averageScorePerQuestion.length > 0 || 
    analyticsData.evaluationsOverTime.length > 0
  );

  // Show empty state if no data
  if (!hasData) {
    return (
      <div className="flex flex-col w-full h-full p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-uGray">Analytics Dashboard</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleClearData}
              disabled={isClearing}
              className="px-4 py-2 bg-uRed text-background rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isClearing ? 'Clearing...' : 'Clear Data'}</span>
            </button>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-uBlue text-background rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Empty State - Enhanced with more content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-background rounded-xl shadow-lg p-16 border border-uGrayLight text-center max-w-2xl">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-uBlue to-uGreen rounded-full flex items-center justify-center mb-8">
              <BarChart3 className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-uGray mb-4">Welcome to Analytics</h3>
            <p className="text-lg text-uGrayLight mb-8 max-w-lg mx-auto leading-relaxed">
              Start evaluating answers in the evaluation page to see comprehensive analytics data here. 
              The dashboard will display detailed insights about your evaluation performance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-uGrayLight/20 rounded-lg p-4">
                <h4 className="font-semibold text-uGray mb-2">📊 Key Metrics</h4>
                <ul className="text-sm text-uGrayLight space-y-1">
                  <li>• Total answers evaluated</li>
                  <li>• Overall average score</li>
                  <li>• Performance trends</li>
                  <li>• Question-wise analysis</li>
                </ul>
              </div>
              <div className="bg-uGrayLight/20 rounded-lg p-4">
                <h4 className="font-semibold text-uGray mb-2">📈 Visual Insights</h4>
                <ul className="text-sm text-uGrayLight space-y-1">
                  <li>• Interactive charts</li>
                  <li>• Score distributions</li>
                  <li>• Time-based analysis</li>
                  <li>• Comparative data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-uGray">Analytics Dashboard</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleClearData}
            disabled={isClearing}
            className="px-4 py-2 bg-uRed text-background rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>{isClearing ? 'Clearing...' : 'Clear Data'}</span>
          </button>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-uBlue text-background rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-uGrayLight mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-uBlue text-uBlue'
                : 'border-transparent text-uGrayLight hover:text-uGray hover:border-uGrayLight'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'charts'
                ? 'border-uBlue text-uBlue'
                : 'border-transparent text-uGrayLight hover:text-uGray hover:border-uGrayLight'
            }`}
          >
            Charts
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <AnalyticsCard
              title="Total Answers Evaluated"
              value={analyticsData.totalAnswers}
              icon={<BarChart3 className="h-8 w-8 text-uBlue" />}
            />
            <AnalyticsCard
              title="Overall Average Score"
              value={analyticsData.overallAverageScore.toFixed(2)}
              subtitle="out of 10"
              icon={<TrendingUp className="h-8 w-8 text-uGreen" />}
            />
            <AnalyticsCard
              title="Questions Evaluated"
              value={analyticsData.averageScorePerQuestion.length}
              icon={<Users className="h-8 w-8 text-uGray" />}
            />
            <AnalyticsCard
              title="Best Performing Question"
              value={
                analyticsData.averageScorePerQuestion.length > 0
                  ? Math.max(...analyticsData.averageScorePerQuestion.map(q => q.averageScore || 0)).toFixed(2)
                  : 'N/A'
              }
              subtitle="average score"
              icon={<Award className="h-8 w-8 text-primary" />}
            />
          </div>

          {/* Main Chart */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-uGray">Evaluations Over Time</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    chartType === 'line'
                      ? 'bg-uBlue text-background'
                      : 'bg-uGrayLight text-uGray hover:bg-uGrayLightLight'
                  }`}
                >
                  Line Chart
                </button>
                <button
                  onClick={() => setChartType('area')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    chartType === 'area'
                      ? 'bg-uBlue text-background'
                      : 'bg-uGrayLight text-uGray hover:bg-uGrayLightLight'
                  }`}
                >
                  Area Chart
                </button>
              </div>
            </div>
            <div className="bg-background rounded-lg shadow-md p-6 border border-uGrayLight">
              <ScoreChart
                data={analyticsData.evaluationsOverTime}
                type={chartType}
              />
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-background rounded-lg shadow-md border border-uGrayLight">
              <QuestionScoresTable data={analyticsData.averageScorePerQuestion} />
            </div>
            <div className="bg-background rounded-lg shadow-md border border-uGrayLight">
              <EvaluationsTable data={evaluationsData} maxRows={5} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'charts' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-background rounded-lg shadow-md p-6 border border-uGrayLight">
              <BarChart 
                data={analyticsData.averageScorePerQuestion}
                title="Question Performance (Bar Chart)"
                dataKey="averageScore"
              />
            </div>
            <div className="bg-background rounded-lg shadow-md p-6 border border-uGrayLight">
              <PieChart 
                data={analyticsData.averageScorePerQuestion}
                title="Score Distribution (Pie Chart)"
                dataKey="totalEvaluations"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
