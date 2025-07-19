import StepContainer from "@/components/setup/StepContainer";
import { useSetup } from "@/context/SetupProvider";

const LocalSetup = () => {
  const { navigate, step, totalSteps } = useSetup();
  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={navigate.next}
      onBack={navigate.back}
    >
      <div className="">
        <h1 className="text-5xl font-semibold text-primary">
          Prepare Your System
        </h1>
        <p className="text-uGrayLight text-lg mt-4">
          Allow us to set up the local evaluation environment. Please wait as we
          check your system and download required components.
        </p>
      </div>

      <div className="w-96 text-sm">
        <div className="flex flex-row gap-2 items-center text-uGrayLight">
          Downloading Ollama...
        </div>
        <div className="flex flex-row gap-2 items-center text-uGrayLight">
          Installing Ollama runtime...
        </div>
        <div className="flex flex-row gap-2 items-center text-uGrayLight">
          Downloading LLM locally...
        </div>
        <div className="flex flex-row gap-2 items-center text-uGrayLight">
          Installing LLM locally...
        </div>

        <p className="text-uGrayLight text-xs text-muted mt-3">
          This may take a few minutes depending on your system performance and
          internet speed.
        </p>
      </div>
    </StepContainer>
  );
};

export default LocalSetup;
