import React from "react";
import clsx from "clsx";
import { useColorMode } from "@/components/ui/color-mode";

const ThemeToggle: React.FC = () => {
  const { colorMode, setColorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between bg-panel border border-uGrayLight rounded-lg px-4 py-3">
        <div className="flex flex-col">
          <span className="text-uGray font-semibold">Theme</span>
          <span className="text-sm text-uGrayLight">Switch between light and dark</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setColorMode("light")}
            className={clsx(
              "px-3 py-1 rounded-md text-sm",
              !isDark
                ? "bg-uBlue text-background"
                : "bg-transparent text-uGrayLight hover:bg-uGrayLightLight"
            )}
            aria-pressed={!isDark}
          >
            Light
          </button>
          <button
            onClick={() => setColorMode("dark")}
            className={clsx(
              "px-3 py-1 rounded-md text-sm",
              isDark
                ? "bg-uBlue text-background"
                : "bg-transparent text-uGrayLight hover:bg-uGrayLightLight"
            )}
            aria-pressed={isDark}
          >
            Dark
          </button>

          {/* Switch */}
          <button
            role="switch"
            aria-checked={isDark}
            onClick={toggleColorMode}
            className={clsx(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              isDark ? "bg-uBlue" : "bg-uGrayLightLight"
            )}
          >
            <span
              className={clsx(
                "inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform",
                isDark ? "translate-x-5" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;


