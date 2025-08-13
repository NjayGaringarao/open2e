import React from 'react';
import type { AnalyticsSummary, EvaluationData } from '@/database/analytics/types';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  analyticsData: AnalyticsSummary;
  evaluationsData: EvaluationData[];
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  analyticsData,
  evaluationsData,
  className = "",
}) => {
  const exportToCSV = () => {
    // Export evaluations data
    const evaluationsCSV = convertToCSV(evaluationsData, [
      { key: 'id', label: 'ID' },
      { key: 'questionContent', label: 'Question' },
      { key: 'answer', label: 'Answer' },
      { key: 'score', label: 'Score' },
      { key: 'justification', label: 'Justification' },
      { key: 'llmModel', label: 'LLM Model' },
      { key: 'timestamp', label: 'Timestamp' },
    ]);

    // Export question summary data
    const questionsCSV = convertToCSV(analyticsData.averageScorePerQuestion, [
      { key: 'questionId', label: 'Question ID' },
      { key: 'questionContent', label: 'Question Content' },
      { key: 'averageScore', label: 'Average Score' },
      { key: 'totalEvaluations', label: 'Total Evaluations' },
    ]);

    // Create and download files
    downloadCSV(evaluationsCSV, 'evaluations.csv');
    downloadCSV(questionsCSV, 'question_summary.csv');

    // Create summary report
    const summaryReport = createSummaryReport(analyticsData);
    downloadCSV(summaryReport, 'analytics_summary.csv');
  };

  const convertToCSV = (data: any[], columns: { key: string; label: string }[]) => {
    const headers = columns.map(col => col.label).join(',');
    const rows = data.map(item => 
      columns.map(col => {
        const value = item[col.key];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const createSummaryReport = (data: AnalyticsSummary) => {
    const summary = [
      ['Metric', 'Value'],
      ['Total Answers Evaluated', data.totalAnswers],
      ['Overall Average Score', data.overallAverageScore.toFixed(2)],
      ['Number of Questions', data.averageScorePerQuestion.length],
      ['Date Range', `${data.evaluationsOverTime[0]?.date || 'N/A'} to ${data.evaluationsOverTime[data.evaluationsOverTime.length - 1]?.date || 'N/A'}`],
    ];
    return summary.map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 ${className}`}
    >
      <Download className="h-4 w-4" />
      <span>Export Data</span>
    </button>
  );
};
