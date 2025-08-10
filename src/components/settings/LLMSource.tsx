import { useState } from "react";
import { useDialog } from "@/context/dialog";
import { toaster } from "@/components/ui/toaster";
import InputBox from "../InputBox";
import clsx from "clsx";
import Loading from "../Loading";
import { Check } from "lucide-react";
import { useLocalSetup } from "@/context/setup/local";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

const LLMSource = () => {
  const status = useConnectionStatus();
  const { confirm } = useDialog();
  const [form, setForm] = useState<string | undefined>();
  const { percent, startInstallation, isInstalling } = useLocalSetup();

  const handleReinstallDependencies = async () => {
    const isConfirmed = await confirm({
      title: "Confirm Reinstall",
      description:
        "This will consume an approximately 3.6 GB of data. Make sure you have an stable internet connection before proceeding. Do you want to Proceed?",
    });

    if (!isConfirmed) return;
    try {
      await startInstallation({ isCleanInstall: true });
      toaster.create({
        title: "Installed Succesfully",
        description: "Succesfully Installed dependency.",
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Installation Failed",
        description: `An Error was encountered during installtion. ${error}`,
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="grid grid-cols-3 gap-2">
        {status === "OFFLINE" && (
          <div className="col-span-3 flex flex-row gap-1 items-center">
            <p className="text-lg text-uGrayLight">
              Encountering an issue using LLM? Try
            </p>
            <button
              onClick={handleReinstallDependencies}
              className={clsx(
                "text-lg text-primary",
                "hover:underline hover:underline-offset-2 hover:font-semibold"
              )}
              disabled={isInstalling}
            >
              Reinstalling Dependencies
            </button>
          </div>
        )}
      </div>
      {status === "ONLINE" ? (
        <div className="pl-8 flex flex-col gap-2">
          <p className="text-lg text-uGrayLight ">
            Openai's API Key is required to continue.
          </p>
          <InputBox
            id="api-key"
            isPassword
            value={form ?? ""}
            setValue={setForm}
            placeholder="sk-..."
            inputClassName={clsx(
              "py-1 px-3 w-full",
              "border border-panel",
              "text-base font-mono"
            )}
          />
        </div>
      ) : (
        isInstalling && (
          <div className="flex flex-col gap-4 pl-8 mt-4">
            {/** Loading Bar */}
            <div className=" flex flex-row items-center gap-2 w-full">
              <p className="w-10 text-primary text-center font-mono">
                {percent}%
              </p>

              <div className="h-3 w-full bg-gray-300 rounded-md overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${percent}%`,
                  }}
                ></div>
              </div>
            </div>

            {/** Prompt */}
            <div className="flex flex-row items-center">
              <div className="w-10 rounded-full">
                {percent === 100 ? (
                  <Check className="text-primary" />
                ) : (
                  <Loading size="small" />
                )}
              </div>
              <p className="text-uGrayLight text-sm font-semibold">
                {percent !== 100
                  ? "Setting up dependency, Please wait..."
                  : "Finish setup."}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default LLMSource;
