"use client";
import clsx from "clsx";
import { Mic, X } from "lucide-react";

interface IParagraphBox {
  title?: string;
  value: string;
  setValue: (param: string) => void;
  inputClassName?: string;
  containerClassname?: string;
  titleClassName?: string;
  placeHolder?: string;
  disabled?: boolean;
  handleClear?: () => void;
}

const ParagraphBox = ({
  title,
  value,
  setValue,
  titleClassName,
  inputClassName,
  containerClassname,
  placeHolder,
  disabled = false,
  handleClear = () => {},
}: IParagraphBox) => {
  return (
    <div className={clsx("relative flex flex-col", containerClassname)}>
      {title && (
        <p
          className={clsx("text-sm lg:text-base text-textBody", titleClassName)}
        >
          {title}
        </p>
      )}

      <textarea
        className={clsx(
          "bg-background border border-textBody w-full rounded-md pl-4 pr-12 py-4 resize-none",
          "text-base lg:text-lg text-textBody font-mono",
          "hover:border hover:border-primary",
          "focus:border-2 focus:border-primary focus:outline-none",
          "placeholder:italic",
          inputClassName
        )}
        rows={5}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeHolder}
        disabled={disabled}
      />
      <div
        className={clsx(
          "absolute bottom-0 top-0 right-4 flex flex-col justify-center gap-2",
          disabled ? "hidden" : "visible"
        )}
      >
        <button
          className={value.length ? "visible" : "hidden"}
          onClick={() => {
            setValue("");
            handleClear();
          }}
        >
          <X className="text-textBody hover:text-primary h-6 w-6" />
        </button>
        <button>
          <Mic className="text-textBody hover:text-primary h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ParagraphBox;
