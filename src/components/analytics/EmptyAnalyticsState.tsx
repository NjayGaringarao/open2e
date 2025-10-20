import React from "react";
import { BarChart3, RefreshCcwIcon } from "lucide-react";
import { cn } from "@/utils/style";

interface EmptyAnalyticsStateProps {
  onRefresh: () => void;
}

export const EmptyAnalyticsState: React.FC<EmptyAnalyticsStateProps> = ({
  onRefresh,
}) => {
  return (
    <div className="flex flex-col flex-1 w-full h-full items-center justify-center">
      <div
        className={cn(
          "relative w-full max-w-5xl rounded-2xl shadow-2xl p-16",
          "border border-uGrayLight/30",
          "text-center",
          "bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm"
        )}
      >
        {/* Background gradient effect */}
        <div
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 rounded-2xl"
          )}
        />
        <div className="relative z-10">
          <div
            className={cn(
              "mx-auto w-32 h-32 rounded-full",
              "flex items-center justify-center mb-8 shadow-2xl",
              "bg-gradient-to-br from-uBlue via-primary to-emerald-500"
            )}
          >
            <BarChart3 className="h-16 w-16 text-white" />
          </div>

          <p className="text-lg text-uGrayLight mb-8 max-w-lg mx-auto leading-relaxed">
            Start evaluating answers in the evaluation page to see comprehensive
            analytics data here. The dashboard will display detailed insights
            about your evaluation performance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div
              className={cn(
                "rounded-xl p-6 border border-blue-500/20",
                "bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-blue-700/10"
              )}
            >
              <h4 className="font-semibold text-uGray mb-3 flex items-center">
                <span className="text-2xl mr-2">📊</span>
                Key Metrics
              </h4>
              <ul className="text-base text-uGrayLight space-y-2">
                <li>• Total answers evaluated</li>
                <li>• Overall average score</li>
                <li>• Performance trends</li>
                <li>• Question-wise analysis</li>
              </ul>
            </div>
            <div
              className={cn(
                "rounded-xl p-6 border border-emerald-500/20",
                "bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-emerald-700/10"
              )}
            >
              <h4 className="font-semibold text-uGray mb-3 flex items-center">
                <span className="text-2xl mr-2">📈</span>
                Visual Insights
              </h4>
              <ul className="text-base text-uGrayLight space-y-2">
                <li>• Interactive charts</li>
                <li>• Score distributions</li>
                <li>• Time-based analysis</li>
                <li>• Comparative data</li>
              </ul>
            </div>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="absolute flex flex-row gap-2 top-4 right-4 text-uGrayLight hover:text-primary"
        >
          Load Data <RefreshCcwIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
