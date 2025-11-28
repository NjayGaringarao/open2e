"use client";

import { DialogTitle } from "@headlessui/react";
import { createContext, useCallback, useState, useRef, useEffect } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import clsx from "clsx";
import Button from "@/components/Button";
import { BaseModal } from "@/components/ui/BaseModal";
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

  /** ALERT HANDLERS **/
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
    const iconClass = clsx(
      "w-16 h-16 border rounded bg-opacity-5 flex-shrink-0",
      mode === "SUCCESS" && "text-background bg-uGreen",
      mode === "ERROR" && "text-background bg-uRed",
      mode === "INFO" && "text-background bg-primary"
    );

    switch (mode) {
      case "SUCCESS":
        return <CheckCircle2 className={iconClass} />;
      case "ERROR":
        return <AlertTriangle className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  /** CONFIRM HANDLERS **/
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

  /** AUTO-DISMISS ALERT **/
  useEffect(() => {
    if (isAlertOpen && typeof alertOptions?.displayTime === "number") {
      autoDismissTimeout.current = setTimeout(() => {
        resolveAlert();
        closeAlert();
      }, alertOptions.displayTime);
    }
    return () => {
      if (autoDismissTimeout.current) clearTimeout(autoDismissTimeout.current);
    };
  }, [isAlertOpen, alertOptions]);

  return (
    <DialogContext.Provider value={{ alert, confirm }}>
      {children}

      {/* ALERT MODAL */}
      <BaseModal
        isOpen={isAlertOpen}
        onClose={() => {
          if (alertOptions?.backdropOnClose) {
            resolveAlert();
            closeAlert();
          }
        }}
      >
        <div className="flex gap-4">
          <div>{getAlertIcon(alertOptions?.mode)}</div>
          <div className="flex flex-col flex-1">
            <p
              className={clsx(
                "font-bold text-xl md:text-2xl",
                getAlertTextColor(alertOptions?.mode)
              )}
            >
              {alertOptions?.title}
            </p>
            {alertOptions?.description && (
              <p className="text-uGrayLight text-base md:text-lg leading-snug">
                {alertOptions.description}
              </p>
            )}
            <div className="self-end">
              <Button
                title={alertOptions?.confirmText || "Okay"}
                onClick={handleAlertConfirm}
                className=" py-2.5 text-base mt-4"
              />
            </div>
          </div>
        </div>
      </BaseModal>

      {/* CONFIRM MODAL */}
      <BaseModal isOpen={isConfirmOpen} onClose={() => {}} preventClose>
        <div className="flex flex-col gap-2">
          <DialogTitle className="text-xl md:text-2xl font-bold text-primary">
            {confirmOptions?.title}
          </DialogTitle>
          {confirmOptions?.description && (
            <p className="text-uGrayLight text-base md:text-lg leading-snug">
              {confirmOptions.description}
            </p>
          )}
          <div className="flex flex-row gap-4 justify-end mt-4">
            <Button
              title={confirmOptions?.confirmText || "Confirm"}
              className={clsx(
                "py-2.5 px-5 text-base",
                confirmOptions?.mode === "CRITICAL" ? "bg-uRed" : "bg-primary"
              )}
              onClick={handleConfirm}
            />
            <Button
              title={confirmOptions?.cancelText || "Cancel"}
              secondary
              className="py-2.5 px-5 text-base"
              onClick={handleCancel}
            />
          </div>
        </div>
      </BaseModal>
    </DialogContext.Provider>
  );
};

/** Helper **/
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
