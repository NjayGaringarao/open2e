import { cn } from "@/utils/style";
import { ReactNode, forwardRef } from "react";

interface IMainContentBox {
  className?: string;
  children: ReactNode;
}

const MainContentBox = forwardRef<HTMLDivElement, IMainContentBox>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className="flex-1 w-full h-screen flex flex-col items-center overflow-y-auto scroll-smooth"
      >
        <div className={cn("w-full max-w-5xl p-8 flex flex-col", className)}>
          {children}
        </div>
      </div>
    );
  }
);

export default MainContentBox;
