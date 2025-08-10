import { useLocation } from "react-router";
import Sidebar from "@/components/Sidebar";
import Home from "./home";
import Evaluate from "./evaluate";
import Settings from "./settings";
import Chat from "./chat";
import { ReactNode, useEffect, useState } from "react";

export default function Layout() {
  const location = useLocation();
  const [pageComponents, setPageComponents] = useState<
    Record<string, ReactNode>
  >({});

  useEffect(() => {
    setPageComponents({
      "/home": <Home />,
      "/evaluate": <Evaluate />,
      "/settings": <Settings />,
      "/chat": <Chat />,
    });
  }, []);

  return (
    <div className="flex h-screen bg-background text-uGrayLight">
      <Sidebar />

      <main className="flex-1 overflow-auto relative">
        {Object.entries(pageComponents).map(([path, element]) => (
          <div
            key={path}
            className={location.pathname === path ? "block" : "hidden"}
          >
            {element}
          </div>
        ))}
        {!Object.keys(pageComponents).includes(location.pathname) && <Home />}
      </main>
    </div>
  );
}
