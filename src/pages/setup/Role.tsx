import clsx from "clsx";
import StepContainer from "@/components/setup/StepContainer";
import { useSetupNavigation } from "@/context/setup/navigation";
import { useSetupProcedure } from "@/context/setup/procedure";

const Role = () => {
  const { navigate, step, totalSteps } = useSetupNavigation();
  const { userRole, setUserRole } = useSetupProcedure();
  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={navigate.next}
      onBack={navigate.back}
      disabledNext={!userRole}
    >
      <h2 className="text-5xl text-primary font-semibold mb-2">
        Select your Role
      </h2>
      <p className="text-uGrayLight text-lg">
        This will determine the set of available tools that you can use.
      </p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/** LEARNER */}
        <div
          onClick={() => setUserRole("LEARNER")}
          className={clsx(
            "p-4 rounded-md bg-panel",
            userRole === "LEARNER" && "border border-primary"
          )}
        >
          <h3 className="text-uGray text-xl font-bold mb-2">LEARNER</h3>
          <ul className="text-uGrayLight text-base list-disc list-inside">
            <li>For student and self-learner.</li>
          </ul>
          <div className="border-t border-uGrayLightLight my-4" />
          <ul className="text-uGrayLight text-base list-disc list-inside">
            <li>Question & Answer Evaluation</li>
            <li>AI Chat</li>
            <li>Performance Analytics</li>
          </ul>
        </div>
        {/** EVALUATOR */}
        <div
          onClick={() => setUserRole("EVALUATOR")}
          className={clsx(
            "p-4 rounded-md bg-panel",
            userRole === "EVALUATOR" && "border border-primary"
          )}
        >
          <h3 className="text-uGray text-xl font-bold mb-2">EVALUATOR</h3>
          <ul className="text-uGrayLight text-base list-disc list-inside">
            <li>For teacher, instructor and etc.</li>
          </ul>
          <div className="border-t border-uGrayLightLight my-4" />
          <ul className="text-uGrayLight text-base list-disc list-inside">
            <li>Batch Evaluation</li>
            <li>Student Management</li>
            <li>Performance Analytics</li>
          </ul>
        </div>
      </div>
    </StepContainer>
  );
};

export default Role;
