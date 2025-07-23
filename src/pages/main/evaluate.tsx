import Evaluator from "@/components/evaluate/variant/Evaluator";
import Learner from "@/components/evaluate/variant/Learner";
import { useSettings } from "@/context/main/settings";

export default function Evaluate() {
  const { userRole } = useSettings();

  return (
    <div className="flex h-screen flex-row gap-6">
      {userRole === "EVALUATOR" ? <Evaluator /> : <Learner />}

      {/* Sidebar for usage info */}
      <div className="hidden 2xl:block bg-panel w-[26rem] transition-all duration-500"></div>
    </div>
  );
}
