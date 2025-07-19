import InputBox from "@/components/InputBox";
import clsx from "clsx";
import StepContainer from "@/components/setup/StepContainer";
import { useSetup } from "@/context/SetupProvider";

const OpenAIKey = () => {
  const { apiKey, setApiKey, navigate, step, totalSteps } = useSetup();
  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={navigate.next}
      onBack={navigate.back}
    >
      <div className="">
        <h1 className="text-5xl font-semibold text-primary">OpenAI API Key</h1>
        <p className="text-uGrayLight text-lg mt-4">
          Paste your OpenAI API key below to enable online access into LLM. The
          system will use your key securely for accessing GPT-4o, this will
          allow you to run open-ended evaluation and/or AI Chat.
        </p>
      </div>

      <div className="flex flex-col w-full">
        <InputBox
          id="api-key"
          isPassword
          value={apiKey}
          setValue={setApiKey}
          placeholder="sk-..."
          inputClassName={clsx(
            "py-2 px-3 w-full",
            "border border-panel",
            "text-lg font-mono"
          )}
        />
        <p className="text-uGrayLight text-xs text-muted mt-2">
          Your key is stored locally and never shared with any external servers.
        </p>
      </div>
    </StepContainer>
  );
};

export default OpenAIKey;
