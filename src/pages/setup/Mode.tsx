import icon from "@/constant/icon";
import clsx from "clsx";
import StepContainer from "@/components/setup/StepContainer";
import { useSetup } from "@/context/SetupProvider";

const Mode = () => {
  const MINIMUM_SYSTEM_MEMORY = 8;

  const { mode, setMode, systemMemory, navigate, step, totalSteps } =
    useSetup();
  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={navigate.next}
      onBack={navigate.back}
      disabledNext={!mode}
    >
      <h2 className="text-5xl text-primary font-semibold mb-2">
        Select Resources
      </h2>
      <p className="text-uGrayLight text-lg">
        Please choose based on the resources that you can afford.
      </p>
      <div className="grid grid-rows-2 gap-4 mt-12">
        {/** ONLINE */}
        <div
          className={clsx(
            "p-4 rounded-md bg-panel",
            mode === "ONLINE" && "border border-primary",
            "flex flex-row gap-4 items-center"
          )}
          onClick={() => setMode("ONLINE")}
        >
          <img
            src={icon.openai}
            alt="openai"
            className="h-12 w-auto bg-white p-1 rounded-md"
          />
          <div className="flex-1">
            <p className="text-xl font-medium text-uGray">
              Use Internet (OpenAI's GPT-4o)
            </p>
            <p className="text-base text-uGrayLight">
              Requires both OpenAI API key and an active internet connection.
            </p>
          </div>
          <div className="px-4">
            <p className="text-xl font-mono text-uGrayLight">P1.20</p>
            <p className="text-xs font-mono text-uGrayLight -mt-1">Est/Eval</p>
          </div>
        </div>
        {/** OFFLINE */}
        <div
          className={clsx(
            "p-4 rounded-md bg-panel",
            mode === "OFFLINE" && "border border-primary",
            "flex flex-row gap-4 items-center",
            systemMemory < MINIMUM_SYSTEM_MEMORY && "opacity-50"
          )}
          onClick={
            systemMemory >= MINIMUM_SYSTEM_MEMORY
              ? () => setMode("OFFLINE")
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
