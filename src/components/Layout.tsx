import { useLocation } from "react-router";
import Sidebar from "./Sidebar";
import Home from "../pages/home";
import Evaluate from "../pages/evaluate";
import Settings from "../pages/settings";

const pageComponents = {
  "/home": <Home />,
  "/evaluate": <Evaluate />,
  "/settings": <Settings />,
};

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background text-textBody">
      <Sidebar />

      <main className="flex-1 overflow-auto p-6 relative">
        {Object.entries(pageComponents).map(([path, element]) => (
          <div
            key={path}
            className={location.pathname === path ? "block" : "hidden"}
          >
            {element}
          </div>
        ))}
      </main>
    </div>
  );
}
