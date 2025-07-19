import icon from "@/constant/icon";

import StepContainer from "@/components/setup/StepContainer";
import { useSetup } from "@/context/SetupProvider";

const Welcome = () => {
  const { step, totalSteps, navigate } = useSetup();
  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={() => navigate.next()}
      onBack={navigate.back}
      hideBack
      nextLabel="Start"
    >
      <img src={icon.logo} alt="open2e" className="h-64 w-64" />
      <h1 className="text-6xl mb-4 text-uGray">
        Welcome to <b className="text-primary">Open2E</b>
      </h1>
      <p className="text-lg text-uGrayLight">
        Let's set things up to get you started with automated open-ended
        evaluation.
      </p>
    </StepContainer>
  );
};

export default Welcome;
