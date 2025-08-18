import React from 'react';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  className?: string;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApplyFilter,
  onResetFilter,
  className = "",
}) => {
  const today = new Date().toISOString().split('T')[0];
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className={`bg-panel rounded-lg shadow-md p-4 border border-uGrayLight ${className}`}>
      <h3 className="text-lg font-semibold text-uGray mb-4">Date Range Filter</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-uGrayLight mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            max={endDate || today}
            className="w-full px-3 py-2 border border-uGrayLight rounded-md bg-background text-uGray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-uGrayLight mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate}
            max={today}
            className="w-full px-3 py-2 border border-uGrayLight rounded-md bg-background text-uGray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onApplyFilter}
          className="px-4 py-2 bg-uBlue text-background rounded-md hover:brightness-110 transition-colors"
        >
          Apply Filter
        </button>
        <button
          onClick={onResetFilter}
          className="px-4 py-2 bg-uGrayLight text-uGray rounded-md hover:bg-uGrayLightLight transition-colors"
        >
          Reset
        </button>
        <button
          onClick={() => {
            onStartDateChange(oneMonthAgo);
            onEndDateChange(today);
          }}
          className="px-4 py-2 bg-uGreen text-background rounded-md hover:brightness-110 transition-colors"
        >
          Last 30 Days
        </button>
      </div>
    </div>
  );
};
