import {
  Transition,
  Dialog,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import InputBox from "../InputBox";
import Button from "../Button";
import { X } from "lucide-react";
import { create } from "@/utils/tag";
import { useDialog } from "@/context/dialog/useDialog";

interface ICreateTag {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  refreshHandle: () => void;
}

const ModalCreateTag = ({
  isVisible,
  setIsVisible,
  refreshHandle,
}: ICreateTag) => {
  const [label, setLabel] = useState("");
  const { alert } = useDialog();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    const { error } = await create(label);

    if (error) {
      alert({
        title: "Save Failed",
        description: error,
        mode: "ERROR",
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setIsVisible(false);
      refreshHandle();
    }
  };

  useEffect(() => {
    setLabel("");
  }, [isVisible]);
  return (
    <Transition appear show={isVisible} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsVisible(false)}
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
            <DialogPanel
              className={clsx(
                "rounded-lg bg-background transform transition-all overflow-hidden ",
                "flex flex-col"
              )}
            >
              <div
                className={clsx(
                  "w-[26rem] p-6 ",
                  "text-left align-middle shadow-xl",
                  "flex flex-col gap-4"
                )}
              >
                <div className="flex flex-row justify-between items-center">
                  <DialogTitle className="text-2xl font-semibold text-primary">
                    New Tag
                  </DialogTitle>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-uGrayLight hover:text-primary"
                  >
                    <X />
                  </button>
                </div>

                <p className="text-uGrayLight text-base -mt-2">
                  Tag Label should be less than 16 characters.
                </p>
                <InputBox
                  value={label}
                  setValue={setLabel}
                  inputClassName="py-1 px-2 text-center text-lg"
                  maxLength={16}
                  placeholder="Class-X"
                />
                <Button
                  title="Save"
                  className="w-24 self-end"
                  disabled={!label.length || isLoading}
                  onClick={handleSave}
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalCreateTag;
