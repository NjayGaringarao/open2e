"use client";
import clsx from "clsx";
import { Mic } from "lucide-react";

interface IInputBox {
  title?: string;
  value: string;
  setValue: (param: string) => void;
  inputClassName?: string;
  containerClassname?: string;
  titleClassName?: string;
  placeHolder?: string;
  disabled?: boolean;
  withVoiceInput?: boolean;
}

const InputBox = ({
  title,
  value,
  setValue,
  titleClassName,
  inputClassName,
  containerClassname,
  placeHolder,
  disabled = false,
  withVoiceInput = false,
}: IInputBox) => {
  return (
    <div className={clsx("relative flex flex-col", containerClassname)}>
      {title && (
        <div
          className={clsx(
            "text-sm lg:text-base text-textBody flex flex-row gap-2",
            titleClassName
          )}
        >
          <p>{title} </p>
        </div>
      )}

      <input
        type="text"
        className={clsx(
          "bg-background border border-textBody w-full rounded-md px-4 py-2 resize-none",
          "text-base lg:text-lg text-textBody font-mono",
          "hover:border hover:border-primary",
          "focus:border-2 focus:border-primary focus:outline-none",
          "placeholder:italic",
          inputClassName,
          withVoiceInput ? "pr-12" : ""
        )}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeHolder}
        disabled={disabled}
      />
      {withVoiceInput && (
        <div
          className={clsx(
            "absolute bottom-2 right-4 flex flex-col justify-center gap-2",
            disabled ? "hidden" : "visible"
          )}
        >
          <button>
            <Mic className="text-textBody hover:text-primary h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default InputBox;
