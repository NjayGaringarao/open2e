import icon from "@/constant/icon";
import StepContainer from "@/components/setup/StepContainer";
import { useSetupProcedure } from "@/context/setup/procedure";

const Welcome = () => {
  const { finishSetup } = useSetupProcedure();
  return (
    <StepContainer
      step={1}
      totalSteps={1}
      onNext={finishSetup}
      onBack={() => {}}
      hideBack
      nextLabel="Get Started"
    >
      <img src={icon.logo} alt="open2e" className="h-64 w-64" />
      <h1 className="text-6xl text-uGray">
        Welcome to <b className="text-primary">Open2E</b>
      </h1>
      <p className="text-lg text-uGrayLight">
        Automated <u className="underline-offset-2">Open Ended Evaluation</u> of
        responses for basic computer literacy.
      </p>
    </StepContainer>
  );
};

export default Welcome;
