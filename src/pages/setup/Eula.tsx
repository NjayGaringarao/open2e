import StepContainer from "@/components/setup/StepContainer";
import { useSetupNavigation } from "@/context/setup/navigation";
import { useSetupProcedure } from "@/context/setup/procedure";

const Eula = () => {
  const { navigate, step, totalSteps } = useSetupNavigation();
  const { isEulaAgreed, setIsEulaAgreed } = useSetupProcedure();
  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={navigate.next}
      onBack={navigate.back}
      disabledNext={!isEulaAgreed}
    >
      <div className="text-2xl text-uGray font-semibold flex flex-row gap-2">
        <h2 className="font-bold">EULA</h2> (End User License Agreement)
      </div>
      <div className="flex-1 overflow-y-auto border p-4 rounded bg-background text-sm">
        {/* EULA text here */}
      </div>
      <label className="flex flex-row items-center self-end gap-2 text-uGrayLight">
        <input
          type="checkbox"
          checked={isEulaAgreed}
          onChange={(e) => setIsEulaAgreed(e.target.checked)}
          className="w-4 h-4 accent-primary"
        />
        I agree to the terms and conditions
      </label>
    </StepContainer>
  );
};

export default Eula;
