import clsx from "clsx";
import { SelectHTMLAttributes } from "react";

interface ISelect extends SelectHTMLAttributes<HTMLSelectElement> {}

const Select = ({ className, ...props }: ISelect) => {
  return (
    <select
      className={clsx(
        "w-auto min-w-44",
        "p-1 px-4 text-base font-semibold rounded-md shadow-base",
        "transition-all transform hover:brightness-110 hover:shadow-uGrayLight",
        "shadow shadow-uGrayLight",
        "hover:border hover:border-primary",
        "text-uGrayLight text-base",
        className
      )}
      {...props}
    >
      {props.children}
    </select>
  );
};

export default Select;
