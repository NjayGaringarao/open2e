import Learner from "@/components/evaluate/learner/Learner";
import { LearnerProvider } from "@/context/main/learner/LearnerProvider";
import { ClipboardCheck } from "lucide-react";

export default function Evaluate() {
  return (
    <div className="flex h-screen flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center">
        <div className="flex flex-1 flex-col w-full max-w-5xl p-6 overflow-y-auto">
          <div className="flex flex-row gap-4 py-8 items-center text-uGray text-4xl font-mono font-semibold">
            <ClipboardCheck className="h-10 w-10" />
            Open Ended Evaluation
          </div>
          <LearnerProvider>
            <Learner />
          </LearnerProvider>
        </div>
      </div>

      {/* Sidebar for usage info */}
      <div className="hidden 2xl:block bg-panel w-96 transition-all duration-500"></div>
    </div>
  );
}
