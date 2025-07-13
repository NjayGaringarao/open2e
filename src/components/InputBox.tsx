"use client";
import clsx from "clsx";
import { Mic } from "lucide-react";
import { InputHTMLAttributes } from "react";

interface IInputBox extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  value: string;
  setValue: (param: string) => void;
  inputClassName?: string;
  containerClassname?: string;
  titleClassName?: string;
  withVoiceInput?: boolean;
  onBlur?: () => void;
}

const InputBox = ({
  title,
  value,
  setValue,
  titleClassName,
  inputClassName,
  containerClassname,
  withVoiceInput = false,
  ...inputProp
}: IInputBox) => {
  return (
    <div className={clsx("relative flex flex-col", containerClassname)}>
      {title && (
        <div
          className={clsx(
            "text-sm text-textBody flex flex-row gap-2",
            titleClassName
          )}
        >
          <p>{title} </p>
        </div>
      )}

      <input
        type="text"
        className={clsx(
          "bg-transparent border border-textBody w-full rounded-md resize-none",
          "text-base lg:text-lg text-textBody font-mono",
          "hover:border hover:border-primary",
          "focus:border-2 focus:border-primary focus:outline-none",
          "placeholder:italic",
          inputClassName,
          withVoiceInput ? "pr-12" : ""
        )}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        {...inputProp}
      />
      {withVoiceInput && (
        <div
          className={clsx(
            "absolute bottom-2 right-4 flex flex-col justify-center gap-2",
            inputProp.disabled ? "hidden" : "visible"
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
