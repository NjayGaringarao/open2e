import { useLocation } from "react-router";
import Sidebar from "@/components/Sidebar";
import Home from "./home";
import Evaluate from "./evaluate";
import Settings from "./settings";
import Chat from "./chat";
import Student from "./student";
import { MainProvider } from "@/context/MainProvider";

const pageComponents = {
  "/home": <Home />,
  "/evaluate": <Evaluate />,
  "/settings": <Settings />,
  "/chat": <Chat />,
  "/student": <Student />,
};

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background text-textBody">
      <Sidebar />

      <main className="flex-1 overflow-auto relative">
        <MainProvider>
          {Object.entries(pageComponents).map(([path, element]) => (
            <div
              key={path}
              className={location.pathname === path ? "block" : "hidden"}
            >
              {element}
            </div>
          ))}
          {!Object.keys(pageComponents).includes(location.pathname) && <Home />}
        </MainProvider>
      </main>
    </div>
  );
}
