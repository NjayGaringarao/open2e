import clsx from "clsx";
import { ChevronRight, ChevronUp } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

interface IDropDown {
  headerElement: React.ReactNode;
  children: React.ReactNode;
}

const DropDown = ({ headerElement, children }: IDropDown) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const updateHeight = () => {
      if (isOpen) setHeight(el.scrollHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen]);

  return (
    <div className="flex flex-col w-full border-y border-uGrayLightLight py-4">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx("flex flex-row gap-4 items-center text-uGray")}
      >
        {isOpen ? <ChevronUp /> : <ChevronRight />}
        {headerElement}
      </button>

      <div
        style={{
          height: isOpen ? height : 0,
          transition: "height 0.3s ease",
        }}
        className={clsx("pl-10 ", isOpen ? "mt-4" : "overflow-hidden")}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
};

export default DropDown;
