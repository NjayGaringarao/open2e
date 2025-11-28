import Evaluation from "@/components/evaluate/Evaluation";
import { EvaluationProvider } from "@/context/main/EvaluationProvider";
import { ClipboardCheck } from "lucide-react";
import MainContentBox from "@/components/container/MainContentBox";
import { HelpPanel } from "@/components/HelpPanel";
import EvaluateHelp from "@/constant/helpContent/EvaluateHelp";

export default function Evaluate() {
  return (
    <div className="flex h-screen flex-row gap-6">
      {/* Main Content */}
      <MainContentBox className="flex flex-col gap-8">
        <div className="flex flex-row gap-4 py-8 items-center text-uGray text-4xl font-mono font-semibold">
          <ClipboardCheck className="h-10 w-10" />
          Open Ended Evaluation
        </div>
        <EvaluationProvider>
          <Evaluation />
        </EvaluationProvider>
      </MainContentBox>

      {/* How to Use Panel */}
      <HelpPanel>
        <EvaluateHelp />
      </HelpPanel>
    </div>
  );
}
