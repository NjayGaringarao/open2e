import StepContainer from "@/components/setup/StepContainer";
import { useSetupNavigation } from "@/context/setup/navigation";
import { useSetupProcedure } from "@/context/setup/procedure";

const OnlineSetup = () => {
  const { step, totalSteps } = useSetupNavigation();
  const { finishSetup } = useSetupProcedure();
  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={finishSetup}
      onBack={() => {}}
      nextLabel="Finish"
      hideBack
    >
      <h2 className="text-5xl font-semibold text-primary">Setup Complete</h2>
      <p className="text-uGrayLight text-lg mt-4">
        You're now ready to explore Open2E. Click "Finish" to get started.
      </p>
    </StepContainer>
  );
};

export default OnlineSetup;
