import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export default function Home() {
  return (
    <div className="flex h-screen flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center">
        <div className="flex flex-1 flex-col w-full max-w-5xl p-6 overflow-y-auto">
          <AnalyticsDashboard />
        </div>
      </div>

      {/* Sidebar for usage info */}
      <div className="hidden 2xl:block bg-panel/60 backdrop-blur w-96 border-l border-white/10 transition-all duration-500"></div>
    </div>
  );
}
