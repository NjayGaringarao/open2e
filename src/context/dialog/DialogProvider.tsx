"use client";

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
  useState,
  Fragment,
  useRef,
  useEffect,
} from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import Button from "@/components/Button";
import {
  AlertMode,
  AlertOptions,
  ConfirmOptions,
  DialogContextType,
} from "@/types/dialog";

export const DialogContext = createContext<DialogContextType | null>(null);

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertOptions, setAlertOptions] = useState<AlertOptions | null>(null);
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(
    null
  );
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [resolveConfirm, setResolveConfirm] = useState<
    (value: boolean) => void
  >(() => () => {});
  const [resolveAlert, setResolveAlert] = useState<() => void>(() => () => {});
  const autoDismissTimeout = useRef<NodeJS.Timeout | null>(null);

  // ALERT FUNCTIONS
  const alert = useCallback((opts: AlertOptions): Promise<void> => {
    return new Promise((resolve) => {
      setAlertOptions(opts);
      setIsAlertOpen(true);
      setResolveAlert(() => resolve);
    });
  }, []);

  const closeAlert = () => {
    setIsAlertOpen(false);
    setTimeout(() => setAlertOptions(null), 200);
  };

  const handleAlertConfirm = () => {
    resolveAlert();
    closeAlert();
  };

  const getAlertIcon = (mode: AlertMode = "INFO") => {
    switch (mode) {
      case "SUCCESS":
        return (
          <CheckCircle2 className="text-uGreen w-24 h-24 border border-uGreen rounded bg-uGreen bg-opacity-5" />
        );
      case "ERROR":
        return (
          <AlertTriangle className="text-uRed w-24 h-24 border border-uRed rounded bg-uRed bg-opacity-5" />
        );
      default:
        return (
          <Info className="text-primary w-24 h-24 border border-primary rounded bg-primary bg-opacity-5" />
        );
    }
  };

  // CONFIRM FUNCTIONS
  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmOptions(opts);
      setIsConfirmOpen(true);
      setResolveConfirm(() => resolve);
    });
  }, []);

  const closeConfirm = () => {
    setIsConfirmOpen(false);
    setTimeout(() => setConfirmOptions(null), 200);
  };

  const handleConfirm = () => {
    resolveConfirm(true);
    closeConfirm();
  };

  const handleCancel = () => {
    resolveConfirm(false);
    closeConfirm();
  };

  useEffect(() => {
    if (isAlertOpen && typeof alertOptions?.displayTime === "number") {
      autoDismissTimeout.current = setTimeout(() => {
        resolveAlert(); // resolve the promise silently
        closeAlert();
      }, alertOptions.displayTime);
    }

    return () => {
      if (autoDismissTimeout.current) {
        clearTimeout(autoDismissTimeout.current);
      }
    };
  }, [isAlertOpen, alertOptions]);

  return (
    <DialogContext.Provider value={{ alert, confirm }}>
      {children}

      {/* ALERT MODAL */}
      <Transition appear show={isAlertOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            if (alertOptions?.backdropOnClose) {
              resolveAlert();
              closeAlert();
            }
          }}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              style={{
                position: "fixed",
                inset: 0,
                opacity: "90%",
                background: "black",
              }}
            ></div>
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
              <DialogPanel className="w-[26rem] transform overflow-hidden rounded-lg bg-background text-left align-middle shadow-xl transition-all flex flex-row p-6 gap-4">
                {getAlertIcon(alertOptions?.mode)}
                <div className="flex flex-col flex-1 gap-2">
                  <DialogTitle
                    className={`text-xl font-semibold ${getAlertTextColor(
                      alertOptions?.mode
                    )}`}
                  >
                    {alertOptions?.title}
                  </DialogTitle>
                  {alertOptions?.description && (
                    <p className="text-uGrayLight text-lg mb-4 leading-snug">
                      {alertOptions.description}
                    </p>
                  )}
                  <Button
                    title={alertOptions?.confirmText || "Okay"}
                    onClick={handleAlertConfirm}
                    className="w-full"
                  />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* CONFIRM MODAL */}
      <Transition appear show={isConfirmOpen} as={Fragment}>
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
            <div
              style={{
                position: "fixed",
                inset: 0,
                opacity: "90%",
                background: "black",
              }}
            ></div>
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
              <DialogPanel className="w-[26rem] transform overflow-hidden rounded-lg bg-background text-left align-middle shadow-xl transition-all p-6">
                <DialogTitle className="text-2xl font-semibold text-primary mb-2">
                  {confirmOptions?.title}
                </DialogTitle>
                {confirmOptions?.description && (
                  <p className="text-uGrayLight text-base mb-6 leading-snug">
                    {confirmOptions.description}
                  </p>
                )}
                <div className="flex flex-row gap-3 justify-end">
                  <Button
                    title={confirmOptions?.confirmText || "Confirm"}
                    className={
                      confirmOptions?.mode === "CRITICAL"
                        ? "bg-uRed"
                        : "bg-primary"
                    }
                    onClick={handleConfirm}
                  />

                  <Button
                    title={confirmOptions?.cancelText || "Cancel"}
                    secondary={true}
                    onClick={handleCancel}
                  />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </DialogContext.Provider>
  );
};

// Helper
function getAlertTextColor(mode: AlertMode = "INFO") {
  switch (mode) {
    case "SUCCESS":
      return "text-uGreen";
    case "ERROR":
      return "text-uRed";
    default:
      return "text-primary";
  }
}
