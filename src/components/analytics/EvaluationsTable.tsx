import React, { useState } from 'react';
import type { EvaluationData } from '@/database/analytics/types';

interface EvaluationsTableProps {
  data: EvaluationData[];
  title?: string;
  maxRows?: number;
}

export const EvaluationsTable: React.FC<EvaluationsTableProps> = ({
  data,
  title = "Recent Evaluations",
  maxRows = 10
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayData = showAll ? data : data.slice(0, maxRows);

  if (data.length === 0) {
    return (
      <div className="bg-background rounded-lg shadow-md p-6 border border-uGrayLight">
        <h3 className="text-lg font-semibold text-uGray mb-4">{title}</h3>
        <div className="flex items-center justify-center h-32 text-uGrayLight">
          <div className="text-center">
            <p className="mb-2">No evaluations yet</p>
            <p className="text-sm text-uGrayLightLight">Start evaluating answers to see detailed evaluation data</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-background rounded-lg shadow-md p-6 border border-uGrayLight">
      <h3 className="text-lg font-semibold text-uGray mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-uGrayLight">
          <thead className="bg-panel">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-uGray uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-uGray uppercase tracking-wider">
                Question
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-uGray uppercase tracking-wider">
                Answer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-uGray uppercase tracking-wider">
                Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-uGray uppercase tracking-wider">
                Model
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-uGray uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-uGrayLight">
            {displayData.map((evaluation) => (
              <tr key={evaluation.id} className="hover:bg-panel">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-uGray">
                  {evaluation.id}
                </td>
                <td className="px-4 py-4 text-sm text-uGray max-w-xs">
                  <div className="truncate" title={evaluation.questionContent}>
                    {truncateText(evaluation.questionContent, 80)}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-uGray max-w-xs">
                  <div className="truncate" title={evaluation.answer}>
                    {truncateText(evaluation.answer, 80)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-uGray">
                  <span className={`font-semibold ${
                    evaluation.score >= 8 ? 'text-uGreen' :
                    evaluation.score >= 6 ? 'text-primary' :
                    'text-uRed'
                  }`}>
                    {evaluation.score}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-uGray">
                  {evaluation.llmModel}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-uGray">
                  {formatDate(evaluation.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length > maxRows && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-uBlue hover:brightness-125 text-sm font-medium"
          >
            {showAll ? `Show less` : `Show all ${data.length} evaluations`}
          </button>
        </div>
      )}
    </div>
  );
};
