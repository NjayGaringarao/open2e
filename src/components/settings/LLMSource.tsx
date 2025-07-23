import { useSettings } from "@/context/main/settings";
import { LLMSource as LLMSourceType } from "@/types/config";
import { useEffect, useState } from "react";
import Button from "../Button";
import Select from "../Select";
import { useDialog } from "@/context/dialog";
import { toaster } from "@/components/ui/toaster";
import InputBox from "../InputBox";
import clsx from "clsx";
import Loading from "../Loading";
import { Check, X } from "lucide-react";
import Markdown from "../Markdown";
import { invoke } from "@tauri-apps/api/core";
import { useLocalSetup } from "@/context/setup/local";

const LLMSource = () => {
  const { llmSource, update, openaiAPIKey } = useSettings();
  const { confirm } = useDialog();
  const [selection, setSelection] = useState<LLMSourceType>(() => llmSource);
  const [form, setForm] = useState<string | undefined>();
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isApikeyValid, setIsApiKeyValid] = useState(false);
  const [prompt, setPrompt] = useState("Validation failed: Invalid API Key");
  const { percent, startInstallation, isInstalling } = useLocalSetup();
  const handleReset = () => {
    setSelection(llmSource);
  };

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

  const handleUpdate = async () => {
    const isConfirmed = await confirm({
      title: "Confirm LLM Source Change?",
      description:
        selection == "LOCAL"
          ? "Applying this change will check or install system dependency.\n\nDo you want to proceed with this change?"
          : "Applying this change will take effect immediately.\n\nDo you want to proceed with this change?",
    });

    if (!isConfirmed) return;

    try {
      setIsLoading(true);

      if (selection === "LOCAL") {
        await startInstallation();
        await update({ llmSource: selection });
      } else {
        await update({ llmSource: selection, openaiAPIKey: form });
      }
      setIsLoading(false);
      toaster.create({
        title: "Updated Succesfully",
        description: "Succesfully updated the UI Mode.",
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Error Encountered",
        description: "There was an error occurred updating the UI Mode.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateKey = async (apiKey: string) => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validateKey(form ?? "");

    // DEBOUNCE
    const timeout = setTimeout(() => {
      validateKey(form ?? "");
    }, 600);
    return () => clearTimeout(timeout);
  }, [form]);

  useEffect(() => {
    setSelection(llmSource);
  }, [llmSource]);

  useEffect(() => {
    setIsModified(selection !== llmSource);
  }, [selection, llmSource]);

  useEffect(() => {
    setForm(openaiAPIKey);
  }, [openaiAPIKey]);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="grid grid-cols-3 gap-2">
        <Select
          value={selection}
          onChange={(e) => setSelection(e.target.value as LLMSourceType)}
          className="col-span-2 text-lg"
        >
          <option key="LEARNER" value="INTERNET">
            Internet (Openai: GPT4o)
          </option>
          <option key="LEARNER" value="LOCAL">
            Local (Microsoft: Phi4-mini)
          </option>
        </Select>
        {llmSource === "LOCAL" && (
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
      {selection === "INTERNET" ? (
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

          <div className="flex flex-row gap-2 text-xs text-uGrayLight items-center">
            {isLoading ? (
              <Loading size="small" />
            ) : isApikeyValid ? (
              <Check className="h-8 w-8 text-uGray" />
            ) : (
              <X className="h-8 w-8 text-uRed" />
            )}
            <p className="font-mono">
              <Markdown text={prompt} />
            </p>
          </div>
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
      {isModified && (
        <div className="w-full flex flex-row justify-end items-center gap-4">
          <Button
            title="Update"
            onClick={handleUpdate}
            disabled={isLoading || (selection === "INTERNET" && !isApikeyValid)}
            className="w-24"
          />
          <Button
            title="Reset"
            onClick={handleReset}
            disabled={isLoading}
            className="w-24"
            secondary
          />
        </div>
      )}
    </div>
  );
};

export default LLMSource;
