import { cn } from "@/utils/style";
import { ReactNode } from "react";

interface IMainContentBox {
  className?: string;
  children: ReactNode;
}

const MainContentBox = ({ className, children }: IMainContentBox) => {
  return (
    <div className={cn("w-full max-w-5xl p-8 flex flex-col", className)}>
      {children}
    </div>
  );
};

export default MainContentBox;
