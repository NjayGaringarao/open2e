import React, { useState } from 'react';
import { AnalyticsCard } from './AnalyticsCard';
import { ScoreChart } from './ScoreChart';
import { QuestionScoresTable } from './QuestionScoresTable';
import { EvaluationsTable } from './EvaluationsTable';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { DateRangeFilter } from './DateRangeFilter';
import { ExportButton } from './ExportButton';
import { PerformanceMetrics } from './PerformanceMetrics';
import { ComparativeAnalysis } from './ComparativeAnalysis';
import { useAnalytics } from '@/hooks/useAnalytics';
import { BarChart3, TrendingUp, Users, Award, Filter, Download, BarChart as BarChartIcon, PieChart as PieChartIcon, Database } from 'lucide-react';
import { generateSampleData } from '@/database/analytics/sampleData';

export const AnalyticsDashboard: React.FC = () => {
  const { analyticsData, evaluationsData, loading, error, refreshData } = useAnalytics();
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'comparison' | 'charts'>('overview');
  const [isGeneratingData, setIsGeneratingData] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading analytics</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={refreshData}
              className="text-red-800 hover:text-red-900 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleGenerateSampleData = async () => {
    setIsGeneratingData(true);
    try {
      const result = await generateSampleData();
      if (result.success) {
        refreshData();
        alert(`Successfully generated ${result.count} sample evaluations!`);
      } else {
        alert(`Error generating sample data: ${result.error}`);
      }
    } catch (error) {
      alert(`Error generating sample data: ${error}`);
    } finally {
      setIsGeneratingData(false);
    }
  };

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No analytics data available</p>
        <button
          onClick={handleGenerateSampleData}
          disabled={isGeneratingData}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto disabled:opacity-50"
        >
          <Database className="h-4 w-4" />
          <span>{isGeneratingData ? 'Generating...' : 'Generate Sample Data'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleGenerateSampleData}
            disabled={isGeneratingData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Database className="h-4 w-4" />
            <span>{isGeneratingData ? 'Generating...' : 'Sample Data'}</span>
          </button>
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <ExportButton 
            analyticsData={analyticsData} 
            evaluationsData={evaluationsData}
            className="flex items-center space-x-2"
          />
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      {showDateFilter && (
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApplyFilter={() => {
            // TODO: Implement date filtering logic
            setShowDateFilter(false);
          }}
          onResetFilter={() => {
            setStartDate('');
            setEndDate('');
            setShowDateFilter(false);
          }}
        />
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'performance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'comparison'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Comparison
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'charts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <AnalyticsCard
              title="Total Answers Evaluated"
              value={analyticsData.totalAnswers}
              icon={<BarChart3 className="h-8 w-8 text-blue-600" />}
            />
            <AnalyticsCard
              title="Overall Average Score"
              value={analyticsData.overallAverageScore.toFixed(2)}
              subtitle="out of 10"
              icon={<TrendingUp className="h-8 w-8 text-green-600" />}
            />
            <AnalyticsCard
              title="Questions Evaluated"
              value={analyticsData.averageScorePerQuestion.length}
              icon={<Users className="h-8 w-8 text-purple-600" />}
            />
            <AnalyticsCard
              title="Best Performing Question"
              value={
                analyticsData.averageScorePerQuestion.length > 0
                  ? Math.max(...analyticsData.averageScorePerQuestion.map(q => q.averageScore || 0)).toFixed(2)
                  : 'N/A'
              }
              subtitle="average score"
              icon={<Award className="h-8 w-8 text-yellow-600" />}
            />
          </div>

          {/* Main Chart */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Evaluations Over Time</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    chartType === 'line'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Line Chart
                </button>
                <button
                  onClick={() => setChartType('area')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    chartType === 'area'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Area Chart
                </button>
              </div>
            </div>
            <ScoreChart
              data={analyticsData.evaluationsOverTime}
              type={chartType}
            />
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuestionScoresTable data={analyticsData.averageScorePerQuestion} />
            <EvaluationsTable data={evaluationsData} maxRows={5} />
          </div>
        </>
      )}

      {activeTab === 'performance' && (
        <PerformanceMetrics
          analyticsData={analyticsData}
          evaluationsData={evaluationsData}
        />
      )}

      {activeTab === 'comparison' && (
        <ComparativeAnalysis
          evaluationsOverTime={analyticsData.evaluationsOverTime}
          questionScores={analyticsData.averageScorePerQuestion}
        />
      )}

      {activeTab === 'charts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart 
              data={analyticsData.averageScorePerQuestion}
              title="Question Performance (Bar Chart)"
              dataKey="averageScore"
            />
            <PieChart 
              data={analyticsData.averageScorePerQuestion}
              title="Score Distribution (Pie Chart)"
              dataKey="totalEvaluations"
            />
          </div>
        </div>
      )}
    </div>
  );
};
