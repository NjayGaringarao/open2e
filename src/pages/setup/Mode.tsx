import icon from "@/constant/icon";
import clsx from "clsx";
import StepContainer from "@/components/setup/StepContainer";
import InputBox from "@/components/InputBox";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Loading from "@/components/Loading";
import { Check, X } from "lucide-react";
import Markdown from "@/components/Markdown";
import { useSetupProcedure } from "@/context/setup/procedure";
import { useSetupNavigation } from "@/context/setup/navigation";

const Mode = () => {
  const MINIMUM_SYSTEM_MEMORY = 8;

  const {
    llmSource,
    setLlmSource,
    systemMemory,
    openaiApiKey,
    setOpenaiApiKey,
  } = useSetupProcedure();

  const { navigate, step, totalSteps } = useSetupNavigation();

  const [isApikeyValid, setIsApiKeyValid] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [prompt, setPrompt] = useState("Validation failed: Invalid API Key");

  const validateKey = async (openaiApiKey: string) => {
    try {
      setVerifying(true);
      const isValid = await invoke<boolean>("validate_key", {
        key: openaiApiKey,
      });
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
    // DEBOUNCE
    const timeout = setTimeout(() => {
      validateKey(openaiApiKey);
    }, 600);
    return () => clearTimeout(timeout);
  }, [openaiApiKey]);

  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={navigate.next}
      onBack={navigate.back}
      disabledNext={!llmSource || (llmSource === "INTERNET" && !isApikeyValid)}
    >
      <h2 className="text-5xl text-primary font-semibold">Select LLM Source</h2>
      <p className="text-uGrayLight text-lg">
        LLM Does the job in evaluating open-ended responses. Select the source
        that works best for your current environment or budget.
      </p>
      <div className="flex flex-col gap-4 mt-12">
        {/** INTERNET */}
        <div
          className={clsx(
            "p-4 rounded-md bg-panel",
            llmSource === "INTERNET" && "border border-primary",
            "flex flex-row gap-4 items-center"
          )}
          onClick={() => setLlmSource("INTERNET")}
        >
          <div className="h-full">
            <img
              src={icon.openai}
              alt="openai"
              className="h-12 w-auto bg-white p-1 rounded-md"
            />
          </div>
          <div className="flex-1">
            <p className="text-xl font-medium text-uGray">
              Use Internet (OpenAI's GPT-4o)
            </p>
            <p className="text-base text-uGrayLight">
              Requires both OpenAI API key and an active internet connection.
            </p>
            <div
              className={clsx(
                "flex-1 flex-col justify-center",
                llmSource === "INTERNET" ? "flex" : "hidden",
                "mt-4"
              )}
            >
              <InputBox
                id="api-key"
                isPassword
                value={openaiApiKey}
                setValue={setOpenaiApiKey}
                placeholder="Paste your API key here..."
                inputClassName={clsx(
                  "py-1 px-3 w-full",
                  "border border-panel",
                  "text-base font-mono"
                )}
              />

              <div className="flex flex-row gap-2 text-xs text-uGrayLight items-center">
                {verifying ? (
                  <Loading size="small" />
                ) : isApikeyValid ? (
                  <Check className="h-8 w-8 text-uGray" />
                ) : (
                  <X className="h-8 w-8 text-uRed" />
                )}
                <div className="font-mono">
                  <Markdown text={prompt} />
                </div>
              </div>
            </div>
          </div>
          <div className="px-4">
            <p className="text-xl font-mono text-uGrayLight">P2.30</p>
            <p className="text-xs font-mono text-uGrayLight -mt-1">Est/Eval</p>
          </div>
        </div>
        {/** LOCAL */}
        <div
          className={clsx(
            "p-4 rounded-md bg-panel",
            llmSource === "LOCAL" && "border border-primary",
            "flex flex-row gap-4 items-center",
            systemMemory < MINIMUM_SYSTEM_MEMORY && "opacity-50"
          )}
          onClick={
            systemMemory >= MINIMUM_SYSTEM_MEMORY
              ? () => setLlmSource("LOCAL")
              : () => {}
          }
        >
          <img
            src={icon.microsoft}
            alt="meta"
            className="h-12 w-12 bg-white p-2 rounded-md object-contain"
          />

          <div className="flex-1">
            {systemMemory >= MINIMUM_SYSTEM_MEMORY ? (
              <>
                <p className="text-xl font-medium text-uGray">
                  Use Local LLM (Microsoft's Phi4-mini)
                </p>
                <p className="text-base text-uGrayLight">
                  Uses system resources and may be slower depending on hardware.
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-medium text-uGray">Use Local LLM</p>
                <p className="text-base text-uGrayLight">
                  Cannot use local LLM on a system with less than 8GB of memory.
                </p>
              </>
            )}
          </div>
          <div className="px-5">
            <p className="text-xl font-mono text-uGrayLight">FREE</p>
          </div>
        </div>
      </div>
    </StepContainer>
  );
};

export default Mode;
