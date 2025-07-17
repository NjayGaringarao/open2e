import clsx from "clsx";

interface IButton {
  title?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  formAction?: (formData: FormData) => void | never;
  secondary?: boolean;
  children?: React.ReactNode;
}
const Button = ({
  title,
  className,
  onClick,
  disabled,
  type = "button",
  secondary = false,
  children,
}: IButton) => {
  return (
    <button
      className={clsx(
        "p-1 px-4 text-base font-semibold rounded-md shadow-base",
        "transition-all transform hover:brightness-110 hover:shadow-uGrayLight",
        "shadow shadow-uGrayLight",
        "hover:border hover:border-primary",
        disabled ? "opacity-50 cursor-not-allowed" : "opacity-100",
        secondary
          ? "bg-transparent text-primary"
          : "bg-primary text-background ",
        "flex flex-row gap-2 items-center justify-center",
        "outline-primary",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children && children}
      {title && title}
    </button>
  );
};

export default Button;
