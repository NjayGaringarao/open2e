import { useLocation } from "react-router";
import Sidebar from "@/components/Sidebar";
import Home from "./home";
import Evaluate from "./evaluate";
import Settings from "./settings";
import Chat from "./chat";
import Rubrics from "./rubrics";
import History from "./history";
import { ReactNode, useEffect, useState } from "react";
import { useSettings } from "@/context/main/settings";

export default function Layout() {
  const location = useLocation();
  const { isAdminLoggedIn, adminPasswordHash } = useSettings();
  const effectiveAdmin = isAdminLoggedIn || !adminPasswordHash;
  const [pageComponents, setPageComponents] = useState<
    Record<string, ReactNode>
  >({});

  useEffect(() => {
    setPageComponents({
      "/home": <Home />,
      "/evaluate": <Evaluate />,
      "/history": <History />,
      "/settings": <Settings />,
      "/chat": <Chat />,
      "/rubrics": <Rubrics />,
    });
  }, []);

  return (
    <div className="flex h-screen bg-background text-uGrayLight relative">
      <div className="absolute inset-0 pointer-events-none bg-radial-glow" />
      <div className="absolute inset-0 opacity-[0.06] [background-size:24px_24px] bg-grid" />
      <Sidebar />

      <main className="flex-1 overflow-auto relative">
        {/* Guard: if student navigates to restricted pages, show Evaluate instead
            When no admin password is set, bypass UAC and show evaluator pages */}
        {!effectiveAdmin &&
        ["/home", "/history", "/rubrics", "/settings"].includes(
          location.pathname,
        ) ? (
          <div className="block">
            <Evaluate />
          </div>
        ) : (
          <>
            {Object.entries(pageComponents).map(([path, element]) => (
              <div
                key={path}
                className={location.pathname === path ? "block" : "hidden"}
              >
                {element}
              </div>
            ))}
            {!Object.keys(pageComponents).includes(location.pathname) && (
              <Home />
            )}
          </>
        )}
      </main>
    </div>
  );
}
