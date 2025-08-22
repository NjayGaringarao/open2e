import React from 'react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  className = "",
}) => {
  return (
    <div className={`bg-background rounded-xl shadow-lg p-6 border border-uGrayLight hover:shadow-xl transition-all duration-300 hover:border-uBlue/30 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-uGrayLight mb-2 uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold text-uGray mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-uGrayLight font-medium">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-6 p-3 bg-gradient-to-br from-uBlue/10 to-uGreen/10 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
