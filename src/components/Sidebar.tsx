import { useState } from "react";
import { Link, useLocation } from "react-router";
import clsx from "clsx";
import icon from "../constant/icon";
import {
  Home,
  Settings,
  MessageSquareText,
  ClipboardCheck,
  User,
  List,
} from "lucide-react";
import { useScreenSize } from "../hooks/useScreenSIze";

const tabs = [
  { name: "Home", path: "/home", icon: Home },
  { name: "Evaluate", path: "/evaluate", icon: ClipboardCheck },
  { name: "Enumerate", path: "/enumerate", icon: List },
  { name: "Chat", path: "/chat", icon: MessageSquareText },
  { name: "Student", path: "/student", icon: User },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const screenSize = useScreenSize();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={clsx(
        "h-full transition-all duration-300 ease-in-out bg-panel p-4 flex flex-col",
        expanded || screenSize === "extralarge" ? "w-60" : "w-20"
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex flex-row items-center gap-2 mb-4">
        <img src={icon.logo} className="w-12 h-12" />

        <h1
          className={clsx(
            "text-xl font-bold text-primary whitespace-nowrap",
            expanded || screenSize === "extralarge" ? "visible" : "hidden"
          )}
        >
          Open2E
        </h1>
      </div>

      <nav className="flex flex-col space-y-2">
        {tabs.map(({ name, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={clsx(
                "flex items-center gap-3 rounded transition group hover:bg-secondary",
                active && "font-semibold border border-primary",
                expanded || screenSize === "extralarge"
                  ? "px-2 py-2"
                  : "justify-center py-2"
              )}
            >
              <Icon
                className={clsx(
                  "w-7 h-7",
                  active ? "text-primary" : "text-textBody"
                )}
              />
              {(expanded || screenSize === "extralarge") && (
                <p className="overflow-hidden ease-in-out ml-1">{name}</p>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
