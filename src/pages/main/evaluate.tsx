import Evaluator from "@/components/evaluate/evaluator/Evaluator";
import Learner from "@/components/evaluate/learner/Learner";
import { EvaluatorProvider } from "@/context/main/evaluator";
import { LearnerProvider } from "@/context/main/learner/LearnerProvider";
import { useSettings } from "@/context/main/settings";

export default function Evaluate() {
  const { userRole } = useSettings();

  return (
    <div className="flex h-screen flex-row gap-6">
      {userRole === "EVALUATOR" ? (
        <EvaluatorProvider>
          <Evaluator />
        </EvaluatorProvider>
      ) : (
        <LearnerProvider>
          <Learner />
        </LearnerProvider>
      )}

      {/* Sidebar for usage info */}
      <div className="hidden 2xl:block bg-panel w-[26rem] transition-all duration-500"></div>
    </div>
  );
}
