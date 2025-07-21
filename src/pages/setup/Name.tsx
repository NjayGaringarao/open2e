import InputBox from "@/components/InputBox";

import clsx from "clsx";

import StepContainer from "@/components/setup/StepContainer";
import { useSetupNavigation } from "@/context/setup/navigation";
import { useSetupProcedure } from "@/context/setup/procedure";

const Name = () => {
  const { navigate, step, totalSteps } = useSetupNavigation();
  const { username, setUsername } = useSetupProcedure();
  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={navigate.next}
      onBack={navigate.back}
      disabledNext={!username.first.length || !username.last.length}
    >
      <div className="">
        <h1 className="text-5xl font-semibold text-primary">
          Let's Get to Know You
        </h1>
        <p className="text-uGrayLight text-lg mt-4">
          Please enter your name. This will be used to personalize your
          experience thoughout the app.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <InputBox
          value={username.first}
          setValue={(e) => setUsername((prev) => ({ ...prev, first: e }))}
          placeholder="First"
          inputClassName={clsx(
            "py-2 px-3",
            "border border-panel",
            "text-lg text-uGrayLight font-mono"
          )}
          maxLength={20}
        />
        <InputBox
          value={username.middle ?? ""}
          setValue={(e) => setUsername((prev) => ({ ...prev, middle: e }))}
          placeholder="Middle (Optional)"
          inputClassName={clsx(
            "py-2 px-3",
            "border border-panel",
            "text-lg text-uGrayLight font-mono"
          )}
          maxLength={20}
        />
        <InputBox
          value={username.last}
          setValue={(e) => setUsername((prev) => ({ ...prev, last: e }))}
          placeholder="Last"
          inputClassName={clsx(
            "py-2 px-3",
            "border border-panel",
            "text-lg text-uGrayLight font-mono"
          )}
          maxLength={20}
        />
      </div>
    </StepContainer>
  );
};

export default Name;
