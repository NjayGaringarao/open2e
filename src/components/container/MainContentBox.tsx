import { cn } from "@/utils/style";
import { ReactNode } from "react";

interface IMainContentBox {
  className?: string;
  children: ReactNode;
}

const MainContentBox = ({ className, children }: IMainContentBox) => {
  return (
    <div className="flex-1 w-full h-screen flex flex-col items-center overflow-y-auto">
      <div className={cn("w-full max-w-5xl p-8 flex flex-col", className)}>
        {children}
      </div>
    </div>
  );
};

export default MainContentBox;
