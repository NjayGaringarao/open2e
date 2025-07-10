import clsx from "clsx";

interface IButton {
  title?: string;
  onClick?: () => void;
  className?: string;
  disable?: boolean;
  type?: "button" | "submit" | "reset";
  formAction?: (formData: FormData) => void | never;
  secondary?: boolean;
  children?: React.ReactNode;
}
const Button = ({
  title,
  className,
  onClick,
  disable,
  type = "button",
  secondary = false,
  children,
}: IButton) => {
  return (
    <button
      className={clsx(
        "p-1 px-4 text-base font-semibold rounded-md shadow-base",
        "transition-all transform hover:brightness-110 hover:shadow-textBody",
        disable ? "opacity-50" : "opacity-100",
        secondary
          ? "bg-transparent border border-primary text-primary"
          : "bg-primary text-background",
        "flex flex-row gap-2 items-center justify-center",
        className
      )}
      onClick={onClick}
      disabled={disable}
      type={type}
    >
      {children && children}
      {title && title}
    </button>
  );
};

export default Button;
