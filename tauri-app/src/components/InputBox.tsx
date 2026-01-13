"use client";
import clsx from "clsx";
import { Eye, EyeClosed } from "lucide-react";
import { InputHTMLAttributes, useEffect, useState } from "react";

interface IInputBox extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  value: string;
  setValue: (param: string) => void;
  inputClassName?: string;
  containerClassname?: string;
  titleClassName?: string;
  withVoiceInput?: boolean;
  onBlur?: () => void;
  isPassword?: boolean;
}

const InputBox = ({
  title,
  value,
  setValue,
  titleClassName,
  inputClassName,
  containerClassname,
  withVoiceInput = false,
  isPassword = false,
  ...inputProp
}: IInputBox) => {
  const [isHidden, setIsHidden] = useState(false);
  

  useEffect(() => {
    if (isPassword) setIsHidden(true);
  }, []);

  return (
    <div className={clsx("relative flex flex-col", containerClassname)}>
      {title && (
        <div
          className={clsx(
            "text-sm lg:text-base text-uGrayLight",
            titleClassName
          )}
        >
          <p>{title} </p>
        </div>
      )}

      <div className="flex-1 relative">
        <input
          type={isHidden ? "password" : "text"}
          className={clsx(
            "bg-transparent",
            "shadow-inner shadow-uGrayLight w-full rounded-md resize-none",
            "text-base lg:text-lg text-uGrayLight font-sans",
            !inputProp.disabled && "hover:border hover:border-primary",
            "outline-primary",
            "placeholder:italic",
            inputClassName,
            isPassword ? "pr-12" : ""
          )}
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value)}
          {...inputProp}
        />
        {/* Voice input removed */}
        {isPassword && (
          <div
            className={clsx(
              "absolute bottom-0 top-0 right-4 flex flex-col justify-center",
              inputProp.disabled ? "hidden" : "visible"
            )}
          >
            <button onClick={() => setIsHidden((prev) => !prev)}>
              {isHidden ? (
                <Eye className="text-uGrayLightLight hover:text-primary h-6 w-6" />
              ) : (
                <EyeClosed className="text-uGrayLightLight hover:text-primary h-6 w-6" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputBox;
