import { useLocation } from "react-router";
import Sidebar from "./components/Sidebar";
import Home from "./pages/home";
import Evaluate from "./pages/evaluate";
import Settings from "./pages/settings";
import Chat from "./pages/chat";

const pageComponents = {
  "/home": <Home />,
  "/evaluate": <Evaluate />,
  "/settings": <Settings />,
  "/chat": <Chat />,
};

export default function App() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background text-textBody">
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
      </main>
    </div>
  );
}
