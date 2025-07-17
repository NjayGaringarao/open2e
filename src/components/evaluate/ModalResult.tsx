import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { ChevronRight, X } from "lucide-react";
import { Fragment } from "react";
import Markdown from "../Markdown";

interface IModalResult {
  score: number;
  justification: string;
  answer: string;
  question?: string;
  onClose: (param?: { re_evaluate: boolean }) => void;
  isVisible: boolean;
}

const ModalResult = ({
  onClose,
  score,
  justification,
  question,
  answer,
  isVisible,
}: IModalResult) => {
  return (
    <Transition appear show={isVisible} as={Fragment}>
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
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
            <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-md bg-background flex flex-col p-6 gap-4 text-left align-middle shadow-xl transition-all">
              <div className="flex flex-row justify-between items-center">
                <DialogTitle
                  as="h3"
                  className="text-2xl font-semibold text-center md:text-start text-uGray"
                >
                  Evaluation Result
                </DialogTitle>
                <button>
                  <X
                    className="h-6 w-6 text-uGrayLight hover:text-primary"
                    onClick={() => {
                      onClose();
                    }}
                  />
                </button>
              </div>
              <div className="flex flex-col items-center gap-6">
                <div className="flex flex-row items-center w-full gap-4">
                  <div className="px-12 py-8 text-4xl font-bold text-uGray border border-primary rounded-md text-center">
                    {score}
                  </div>
                  <ChevronRight className="h-12 w-12 text-uGrayLight" />
                  <div className="text-base text-uGrayLight font-mono flex flex-col gap-3 flex-1 max-h-52 overflow-y-auto pr-1">
                    <p className="text-uGrayLight font-sans text-lg underline underline-offset-2">
                      Why you got that score?
                    </p>
                    <Markdown text={justification} />
                  </div>
                </div>
                <div className="flex flex-row items-center justify-end gap-2 w-full">
                  <p className="text-uGrayLight text-base italic">
                    Not satisfied with the score?
                  </p>
                  <button
                    className="text-background px-2 py-1 bg-primary rounded-md hover:brightness-110"
                    onClick={() => {
                      onClose({ re_evaluate: true });
                    }}
                  >
                    Evaluate Again
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-2 w-full border-t-2 border-primary pt-4 text-uGrayLight text-sm opacity-70">
                  <p className="font-semibold">QUESTION</p>
                  <p className=" col-span-6 font-mono truncate">
                    {": ".concat(question!)}
                  </p>
                  <p className="font-semibold">ANSWER</p>
                  <p className=" col-span-6 font-mono">{": ".concat(answer)}</p>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalResult;
