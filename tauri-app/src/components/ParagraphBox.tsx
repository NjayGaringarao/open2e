"use client";
import clsx from "clsx";
import { X } from "lucide-react";
import { InputHTMLAttributes } from "react";

interface IParagraphBox extends InputHTMLAttributes<HTMLTextAreaElement> {
  title?: string;
  value: string;
  setValue: (param: string) => void;
  inputClassName?: string;
  containerClassname?: string;
  titleClassName?: string;
  placeHolder?: string;
  disabled?: boolean;
  handleClear?: () => void;
  rows?: number;
  withVoiceInput?: boolean;
  withClearButton?: boolean;
}

const ParagraphBox = ({
  title,
  value,
  setValue,
  titleClassName,
  inputClassName,
  containerClassname,
  disabled = false,
  withVoiceInput = false,
  withClearButton = false,
  handleClear = () => {},
  ...textAreaProp
}: IParagraphBox) => {
  

  return (
    <div className={clsx("relative flex flex-col", containerClassname)}>
      {title && (
        <label
          className={clsx(
            "text-sm lg:text-base text-uGrayLight",
            titleClassName
          )}
        >
          {title}
        </label>
      )}

      <textarea
        className={clsx(
          "bg-transparent w-full rounded-md px-4 py-2",
          "resize-none whitespace-pre-wrap",
          "text-base lg:text-lg text-uGrayLight font-sans",
          !disabled && "hover:border hover:border-primary",
          "shadow-inner shadow-uGrayLight w-full rounded-md",
          "outline-primary",
          "placeholder:italic",
          inputClassName,
          withClearButton && "pr-12"
        )}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        {...textAreaProp}
      />
      <div
        className={clsx(
          "absolute bottom-0 top-0 right-4 flex flex-col justify-center gap-2",
          disabled || !withClearButton
            ? "hidden"
            : "visible"
        )}
      >
        {withClearButton && (
          <button
            className={value.length ? "visible" : "hidden"}
            onClick={() => {
              setValue("");
              handleClear();
            }}
          >
            <X className="text-uGrayLight hover:text-primary h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ParagraphBox;
