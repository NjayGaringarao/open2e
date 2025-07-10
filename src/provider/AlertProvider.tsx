"use client";

import Button from "@/components/Button";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  Fragment,
} from "react";
import { Info, CheckCircle2, AlertTriangle } from "lucide-react"; // icons for INFO, SUCCESS, ERROR

type AlertMode = "INFO" | "SUCCESS" | "ERROR";

type AlertOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  onConfirm?: () => void;
  mode?: AlertMode;
};

type AlertContextType = {
  showAlert: (options: AlertOptions) => void;
};

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertProvider");
  return ctx;
};

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [options, setOptions] = useState<AlertOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showAlert = useCallback((opts: AlertOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const close = () => {
    setIsOpen(false);
    setTimeout(() => setOptions(null), 200);
  };

  const handleConfirm = () => {
    if (options?.onConfirm) options.onConfirm();
    close();
  };

  const getIconAndColor = (mode: AlertMode = "INFO") => {
    switch (mode) {
      case "SUCCESS":
        return {
          icon: (
            <CheckCircle2 className="text-success w-24 h-24 border rounded bg-success/5" />
          ),
          titleColor: "text-success",
        };
      case "ERROR":
        return {
          icon: (
            <AlertTriangle className="text-error w-24 h-24 border rounded bg-error/5" />
          ),
          titleColor: "text-error",
        };
      default:
        return {
          icon: (
            <Info className="text-primary w-24 h-24 border rounded bg-primary/5" />
          ),
          titleColor: "text-primary",
        };
    }
  };

  const { icon, titleColor } = getIconAndColor(options?.mode);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-background text-left align-middle shadow-xl transition-all flex flex-row p-6 gap-4">
                {icon}
                <div className="flex flex-col flex-1 gap-2">
                  <DialogTitle
                    className={`text-2xl font-semibold ${titleColor}`}
                  >
                    {options?.title}
                  </DialogTitle>

                  <div className="">
                    {options?.description && (
                      <p
                        className="text-textBody text-lg mb-4"
                        style={{ lineHeight: 1.2 }}
                      >
                        {options.description}
                      </p>
                    )}
                  </div>

                  <Button
                    title={options?.confirmText || "Okay"}
                    onClick={handleConfirm}
                    className="w-full"
                  />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </AlertContext.Provider>
  );
};
