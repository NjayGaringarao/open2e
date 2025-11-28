import React from "react";
import { cn } from "@/utils/style";

export type TabType = "overview" | "charts" | "rank" | "forecast";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "charts", label: "Charts" },
  { id: "rank", label: "Rank" },
  { id: "forecast", label: "Forecast" },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b border-uGrayLight/30 mb-8">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "py-2 px-1 border-b-2 font-medium text-sm transition-all duration-300",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-uGrayLight hover:text-uGray hover:border-uGrayLight"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
