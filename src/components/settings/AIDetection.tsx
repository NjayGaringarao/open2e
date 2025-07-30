import { useEffect, useState } from "react";
import InputBox from "../InputBox";
import clsx from "clsx";
import Loading from "../Loading";
import { Check, X } from "lucide-react";
import Markdown from "../Markdown";
import Button from "../Button";
import { useDialog } from "@/context/dialog";
import { useSettings } from "@/context/main/settings";
import { toaster } from "@/components/ui/toaster";
import { validateApiKey } from "@/lib/sapling/api";

const AIDetection = () => {
  const { confirm } = useDialog();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<string>();
  const [isApikeyValid, setIsApiKeyValid] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [prompt, setPrompt] = useState<string>();
  const { update, saplingAPIKey } = useSettings();

  const validate = async (apiKey: string) => {
    try {
      setIsLoading(true);
      setPrompt("Please wait...");
      if (!form?.length) {
        setPrompt(undefined);
        return;
      }

      const { error } = await validateApiKey(apiKey);

      setIsApiKeyValid(!error);

      setPrompt(
        error
          ? "Incorrect API key provided or no internet connection. You can find your API key [here](https://sapling.ai/api_settings?utm_source=sapling.ai&utm_medium=documentation&utm_campaign=apidocs)."
          : "Validation Success: API Key is Valid."
      );
    } catch (error) {
      setIsApiKeyValid(false);
      setPrompt(
        "Incorrect API key provided or no internet connection. You can find your API key [here](https://sapling.ai/api_settings?utm_source=sapling.ai&utm_medium=documentation&utm_campaign=apidocs)."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm(saplingAPIKey);
  };

  const handleUpdate = async () => {
    const isConfirmed = await confirm({
      title: "Confirm Changes?",
      description: "The API Key provided will be used. Do you want to proceed?",
    });

    if (!isConfirmed) return;

    try {
      setIsLoading(true);

      await update({ saplingAPIKey: form });

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

  useEffect(() => {
    // DEBOUNCE
    const timeout = setTimeout(() => {
      form && validate(form);
    }, 600);
    return () => clearTimeout(timeout);
  }, [form]);

  useEffect(() => {
    setIsModified(form !== saplingAPIKey);
  }, [form]);

  return (
    <div className="pl-8 flex flex-col gap-2">
      <p className="text-lg text-uGrayLight ">Sapling AI API Key.</p>
      <InputBox
        id="api-key"
        isPassword
        value={form ?? ""}
        setValue={(e) => setForm(e.length ? e : undefined)}
        placeholder="Paste here..."
        inputClassName={clsx(
          "py-1 px-3 w-full",
          "border border-panel",
          "text-base font-mono"
        )}
      />

      {form && (
        <div className="flex flex-row gap-2 text-xs text-uGrayLight items-center">
          {isLoading ? (
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
      )}
      {isModified && (
        <div className="w-full flex flex-row justify-end items-center gap-4">
          <Button
            title="Update"
            onClick={handleUpdate}
            disabled={isLoading || !isApikeyValid || !isModified}
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

export default AIDetection;
