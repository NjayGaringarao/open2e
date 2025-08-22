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
    <div className={`relative bg-gradient-to-br from-background via-background/95 to-background/90 rounded-xl shadow-xl p-6 border border-uGrayLight/30 hover:shadow-2xl transition-all duration-500 hover:border-primary/30 backdrop-blur-sm group ${className}`}>
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-uGrayLight mb-2 uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-uGray via-primary to-uGray bg-clip-text text-transparent mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-uGrayLight font-medium">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-6 p-4 bg-gradient-to-br from-primary/10 via-primary/5 to-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
