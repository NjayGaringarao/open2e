import InputBox from "@/components/InputBox";
import clsx from "clsx";
import StepContainer from "@/components/setup/StepContainer";
import { useSetup } from "@/context/SetupProvider";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Loading from "@/components/Loading";
import { Check, X } from "lucide-react";
import Markdown from "@/components/Markdown";

const OpenAIKey = () => {
  const { apiKey, setApiKey, navigate, step, totalSteps } = useSetup();
  const [isApikeyValid, setIsApiKeyValid] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [prompt, setPrompt] = useState("Validation failed: Invalid API Key");

  const validateKey = async (apiKey: string) => {
    try {
      setVerifying(true);
      const isValid = await invoke<boolean>("validate_key", { key: apiKey });
      setIsApiKeyValid(isValid);
      setPrompt(
        isValid
          ? "Validation Success: API Key is Valid."
          : "Incorrect API key provided or no internet connection. You can find your API key at [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)."
      );
    } catch (error) {
      setIsApiKeyValid(false);
      setPrompt(
        "Incorrect API key provided or no internet connection. You can find your API key at [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)."
      );
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    validateKey(apiKey);

    // DEBOUNCE
    const timeout = setTimeout(() => {
      validateKey(apiKey);
    }, 600);
    return () => clearTimeout(timeout);
  }, [apiKey]);

  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={navigate.next}
      onBack={navigate.back}
      disabledNext={!isApikeyValid || verifying}
    >
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-5xl font-semibold text-primary">OpenAI API Key</h1>
        <p className="text-uGrayLight text-lg mt-4">
          Paste your OpenAI API key below to enable online access into LLM. The
          system will use your key securely for accessing GPT-4o, this will
          allow you to run open-ended evaluation and/or AI Chat.
        </p>

        <InputBox
          id="api-key"
          isPassword
          value={apiKey}
          setValue={setApiKey}
          placeholder="sk-..."
          inputClassName={clsx(
            "py-2 px-3 w-full",
            "border border-panel",
            "text-lg font-mono",
            "mt-8"
          )}
        />
        <p className="text-uGrayLight text-xs text-muted mt-2">
          Your key is stored locally and never shared with any external servers.
        </p>
      </div>

      <div className="flex flex-row gap-4 text-sm text-uGrayLight items-center">
        {verifying ? (
          <Loading size="small" />
        ) : isApikeyValid ? (
          <Check className="h-12 w-12 text-uGray" />
        ) : (
          <X className="h-12 w-12 text-uGray" />
        )}
        <p className=" font-mono">
          <Markdown text={prompt} />
        </p>
      </div>
    </StepContainer>
  );
};

export default OpenAIKey;
