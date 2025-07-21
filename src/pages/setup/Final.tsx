import StepContainer from "@/components/setup/StepContainer";
import { useSetupNavigation } from "@/context/setup/navigation";

const Final = () => {
  const { navigate, step, totalSteps } = useSetupNavigation();
  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={navigate.next}
      onBack={navigate.back}
      nextLabel="Finish"
    >
      <h2 className="text-5xl font-semibold text-primary">Setup Complete</h2>
      <p className="text-uGrayLight text-lg mt-4">
        You're now ready to explore Open2E. Click "Finish" to get started.
      </p>
    </StepContainer>
  );
};

export default Final;
