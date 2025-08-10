import Learner from "@/components/evaluate/learner/Learner";
import { LearnerProvider } from "@/context/main/learner/LearnerProvider";

export default function Evaluate() {
  return (
    <div className="flex h-screen flex-row gap-6">
      <LearnerProvider>
        <Learner />
      </LearnerProvider>

      {/* Sidebar for usage info */}
      <div className="hidden 2xl:block bg-panel w-[26rem] transition-all duration-500"></div>
    </div>
  );
}
