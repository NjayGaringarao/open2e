import { History } from "lucide-react";
import MainContentBox from "@/components/container/MainContentBox";
import { HelpPanel } from "@/components/HelpPanel";
import { EvaluationHistoryProvider } from "@/context/main/EvaluationHistoryProvider";
import EvaluationHistoryList from "@/components/history/EvaluationHistoryList";
import ListFilters from "@/components/history/ListFilters";
import HistoryHelp from "@/constant/helpContent/HistoryHelp";

export default function HistoryPage() {
  return (
    <div className="flex h-screen flex-row gap-6">
      {/* Main Content */}
      <MainContentBox className="flex flex-col gap-8">
        <div className="flex flex-row gap-4 py-8 items-center text-uGray text-4xl font-mono font-semibold">
          <History className="h-10 w-10" />
          Evaluation History
        </div>

        <EvaluationHistoryProvider>
          <ListFilters />
          <EvaluationHistoryList />
        </EvaluationHistoryProvider>
      </MainContentBox>

      {/* How to Use Panel */}
      <HelpPanel>
        <HistoryHelp />
      </HelpPanel>
    </div>
  );
}
