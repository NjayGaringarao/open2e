import { useState, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Menu } from "lucide-react";
import ConversationController from "./ConversationController";

const ConversationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop view */}
      <div className="hidden 2xl:block h-full overflow-y-auto bg-gradient-to-b from-panel/80 to-panel/60 backdrop-blur-sm w-96 border-r border-uGrayLight/30">
        <ConversationController />
      </div>

      {/* Floating button for mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-20 sm:top-8 sm:right-24 z-40 2xl:hidden bg-gradient-to-r from-primary to-primary/90 text-background p-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:from-primary/90 hover:to-primary"
        aria-label="Open conversations"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Slide-in drawer for mobile */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="fixed inset-y-0 right-0 w-80 max-w-full bg-gradient-to-b from-background via-background/95 to-background/90 shadow-2xl border-l border-uGrayLight/30 z-50 flex flex-col backdrop-blur-sm">
              <div className="overflow-y-auto flex-1">
                <ConversationController />
              </div>
            </DialogPanel>
          </TransitionChild>

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
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
};

export default ConversationPanel;
