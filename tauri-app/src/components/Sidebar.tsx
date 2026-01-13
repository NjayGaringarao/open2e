import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router";
import clsx from "clsx";
import icon from "../constant/icon";
import {
  Home,
  Settings,
  MessageSquareText,
  ClipboardCheck,
  LucideProps,
  ListTodo,
  History,
  LogIn,
  LogOut,
} from "lucide-react";
import { useScreenSize } from "../hooks/useScreenSIze";
import { useSettings } from "@/context/main/settings";
import BaseModal from "@/components/container/BaseModal";
import InputBox from "@/components/InputBox";
import Button from "@/components/Button";

type Tab = {
  name: string;
  path: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export default function Sidebar() {
  const screenSize = useScreenSize();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    adminPasswordHash,
  } = useSettings();
  const [expanded, setExpanded] = useState(false);
  const [tabList, setTabList] = useState<Tab[]>([]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const effectiveAdmin = isAdminLoggedIn || !adminPasswordHash;

  useEffect(() => {
    setTabList([
      { name: "Home", path: "/home", icon: Home },
      { name: "Evaluate", path: "/evaluate", icon: ClipboardCheck },
      { name: "History", path: "/history", icon: History },
      { name: "Chat", path: "/chat", icon: MessageSquareText },
      { name: "Rubrics", path: "/rubrics", icon: ListTodo },
      { name: "Configuration", path: "/settings", icon: Settings },
    ]);
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      window.history.replaceState({}, "", effectiveAdmin ? "/home" : "/evaluate");
    }
  }, [effectiveAdmin]);

  return (
    <aside
      className={clsx(
        "h-full transition-all duration-300 ease-in-out bg-panel/60 backdrop-blur p-4 flex flex-col border-r border-uGrayLight",
        expanded || screenSize === "extralarge" ? "w-60" : "w-20"
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex flex-row items-center gap-2 mb-4">
        <img src={icon.logo} className="w-12 h-12 rounded-full shadow-glow" />

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
        {(tabList.filter(({ path }) =>
          effectiveAdmin
            ? ["/home", "/history", "/chat", "/rubrics", "/settings"].includes(path)
            : ["/evaluate", "/chat"].includes(path)
        )).map(({ name, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={clsx(
                "flex items-center gap-3 rounded transition group hover:bg-secondary/60",
                active &&
                  "font-semibold border border-primary/40 bg-secondary/40",
                expanded || screenSize === "extralarge"
                  ? "px-2 py-2"
                  : "justify-center py-2"
              )}
            >
              <Icon
                className={clsx(
                  "w-7 h-7",
                  active ? "text-primary" : "text-uGray"
                )}
              />
              {(expanded || screenSize === "extralarge") && (
                <p className="overflow-hidden ease-in-out ml-1 text-uGray">
                  {name}
                </p>
              )}
            </button>
          );
        })}
        {adminPasswordHash && (
        <div className={clsx("pt-2 mt-2 border-t border-uGrayLight/30")}></div>
        )}
        {adminPasswordHash && (
        <button
          onClick={async () => {
            if (isAdminLoggedIn) {
              logoutAdmin();
              // If on evaluator-only page after logout, send to /evaluate
              if (["/home", "/history", "/rubrics", "/settings"].includes(location.pathname)) {
                navigate("/evaluate");
              }
              return;
            }
            setShowAdminModal(true);
          }}
          className={clsx(
            "flex items-center gap-3 rounded transition group hover:bg-secondary/60",
            "px-2 py-2",
            "mt-2"
          )}
        >
          {(isAdminLoggedIn ? (
            <LogOut className="w-7 h-7 text-uGray" />
          ) : (
            <LogIn className="w-7 h-7 text-uGray" />
          ))}
          {(expanded || screenSize === "extralarge") && (
            <p className="overflow-hidden ease-in-out ml-1 text-uGray">
              {isAdminLoggedIn ? "Logout Evaluator" : "Login as Evaluator"}
            </p>
          )}
        </button>
        )}
      </nav>

      {/* Admin Login Modal */}
      <BaseModal
        isOpen={showAdminModal}
        onClose={() => {
          setShowAdminModal(false);
          setAdminPasswordInput("");
          setLoginError(null);
        }}
        title="Evaluator Login"
      >
        <div className="p-6 space-y-4">
          {!adminPasswordHash ? (
            <div className="space-y-4">
              <p className="text-uGrayLight text-sm">
                No evaluator password is set. Go to Configuration → Access Control to create one.
              </p>
              <div className="flex gap-2">
                <Button
                  title="Go to Configuration"
                  onClick={() => {
                    setShowAdminModal(false);
                    navigate("/settings");
                  }}
                />
                <Button
                  title="Cancel"
                  secondary
                  onClick={() => {
                    setShowAdminModal(false);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <InputBox
                title="Password"
                placeholder="Enter admin password"
                value={adminPasswordInput}
                setValue={(v) => setAdminPasswordInput(v)}
                isPassword
                inputClassName="px-3 py-2"
              />
              {loginError && (
                <p className="text-red-500 text-sm">{loginError}</p>
              )}
              <div className="flex gap-2">
                <Button
                  title="Login"
                  onClick={async () => {
                    setLoginError(null);
                    if (!adminPasswordInput) {
                      setLoginError("Please enter a password");
                      return;
                    }
                    const ok = await loginAdmin(adminPasswordInput);
                    if (ok) {
                      setShowAdminModal(false);
                      setAdminPasswordInput("");
                      navigate("/home");
                    } else {
                      setLoginError("Incorrect password");
                    }
                  }}
                />
                <Button
                  title="Cancel"
                  secondary
                  onClick={() => {
                    setShowAdminModal(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </BaseModal>
    </aside>
  );
}
