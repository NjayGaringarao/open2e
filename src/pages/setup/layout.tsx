import { invoke } from "@tauri-apps/api/core";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";

const Layout = () => {
  // TODO: Implement Setup Layout and pages
  // FOR NOW: Just a button to continue to main window

  return (
    <div
      data-tauri-drag-region
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#1a1a1a",
        color: "white",
        fontSize: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      This is Setup Window
      <button
        onClick={() => {
          invoke("initialize_app");
        }}
        className={clsx(
          "absolute bottom-8 right-8",
          "bg-primary px-4 py-2 rounded-md",
          "text-background text-lg",
          "flex flex-row items-center"
        )}
      >
        Continue
        <ChevronRight className="text-background h-6 w-6" />
      </button>
    </div>
  );
};

export default Layout;
