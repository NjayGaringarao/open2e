import React from "react";
import { cn } from "@/utils/style";

export const LoadingAnalyticsState: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full p-6 overflow-y-auto">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-uBlue/20 mx-auto mb-6"></div>
            <div
              className={cn(
                "absolute inset-0 h-16 w-16 rounded-full mx-auto",
                "animate-spin border-4 border-transparent border-t-uBlue"
              )}
            ></div>
          </div>
          <p className="text-uGrayLight text-lg">Loading analytics...</p>
        </div>
      </div>
    </div>
  );
};
