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
      <h1 className="text-6xl mb-4 text-uGray">
        Welcome to <b className="text-primary">Open2E</b>
      </h1>
      <p className="text-lg text-uGrayLight">
        You’re all set. Click Get Started to begin using Open2E.
      </p>
    </StepContainer>
  );
};

export default Welcome;
