import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { ArrowRight, VolumeOff, Volume2, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useSpeech } from "@/context/speech";
import clsx from "clsx";
import DropDown from "../DropDown";
import { useChat } from "@/context/main/chat";
import { useNavigate } from "react-router";
import Button from "../Button";
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
  const navigate = useNavigate();
  const { talk, ask, cancelTalk, cancelAsk } = useSpeech();
  const { sendMessage } = useChat();
  const [isSpeeching, setIsSpeeching] = useState(false);

  const createConversation = async () => {
    cancelInteract();
    await navigate("/chat", {});
    onClose();
    await sendMessage(
      `Hello, Lets discuss about the topics related to this question: "${question}"`,
      true
    );
  };

  const interact = async () => {
    if (justification) {
      setIsSpeeching(true);
      await talk(
        `You've got ${score} over 10. It is because: `.concat(justification)
      );

      const isCreateConversation = await ask(
        "Are you interested about this topic? Please answer in Yes or No."
      );
      setIsSpeeching(false);

      if (isCreateConversation) createConversation();
    }
  };

  const cancelInteract = () => {
    setIsSpeeching(false);
    cancelAsk();
    cancelTalk();
  };

  useEffect(() => {
    if (isVisible) {
      interact();
    } else {
      cancelInteract();
    }
  }, [isVisible]);

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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
                "w-full max-w-4xl",
                "transform overflow-hidden rounded-xl bg-background",
                "flex flex-col p-6 gap-4 text-left align-middle shadow-2xl transition-all",
                "border border-uGrayLight"
              )}
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <DialogTitle
                  as="h3"
                  className="text-2xl font-bold text-uGray tracking-tight"
                >
                  Evaluation Result
                </DialogTitle>
                <button
                  className="p-1 rounded hover:bg-uGray/10 transition"
                  onClick={() => onClose()}
                  aria-label="Close"
                >
                  <X className="h-6 w-6 text-uGrayLight hover:text-primary" />
                </button>
              </div>

              {/* Score and Justification */}
              <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                <div
                  className={clsx(
                    "px-10 py-14 text-5xl font-extrabold text-uGray",
                    `bg-score-${score}`,
                    " rounded-lg text-center shadow-sm"
                  )}
                >
                  {score}/10
                </div>
                <ArrowRight className="hidden md:block h-10 w-10 text-uGrayLight" />
                <div
                  className={clsx(
                    "flex-1 flex flex-col gap-3 pr-1",
                    "text-base text-uGrayLight font-mono",
                    "shadow-md"
                  )}
                >
                  <div className="relative overflow-hidden">
                    <div className=" pb-4 max-h-72 overflow-y-auto shadow-md rounded-md bg-background">
                      {/* Sticky Header */}
                      <div
                        className={clsx(
                          "sticky top-0 z-10 py-4 px-4",
                          "bg-panel/80 backdrop-blur-sm border-b border-uGrayLight",
                          "flex flex-row gap-1 items-center"
                        )}
                      >
                        <p className="font-semibold text-lg">Justification</p>
                        <Button
                          onClick={isSpeeching ? cancelInteract : interact}
                          secondary
                          className="p-0"
                        >
                          {isSpeeching ? <VolumeOff /> : <Volume2 />}
                        </Button>
                      </div>
                      <div className="px-4">
                        <Markdown text={justification} />
                        <div className="h-8" />
                      </div>
                    </div>

                    {/* Gradient overlay */}
                    <div
                      className={clsx(
                        "pointer-events-none absolute bottom-0 left-0 right-0 h-8",
                        "bg-gradient-to-t from-background to-transparent",
                        "rounded-b-md"
                      )}
                    />
                  </div>
                </div>
              </div>

              <div
                className={clsx(
                  "flex flex-row w-full justify-center gap-1",
                  "text-lg text-uGray"
                )}
              >
                <p>Interested with this topic?</p>
                <button
                  className="underline underline-offset-2 hover:text-primary"
                  onClick={createConversation}
                >
                  Continue to Chat.
                </button>
              </div>

              {/* Inputs Section */}

              <DropDown
                containerClassName="border-t py-2"
                headerElement={
                  <div className="flex flex-row flex-between">
                    <p className="text-xl font-semibold text-uGray mb-1">
                      Evaluation Input
                    </p>
                  </div>
                }
              >
                <div className="w-full flex flex-col gap-4">
                  <div className="relative ">
                    <div
                      className={clsx(
                        "grid grid-cols-1 md:grid-cols-7 gap-2",
                        "w-full overflow-y-auto max-h-28 pt-4",
                        "rounded-md p-4 shadow-md",
                        "text-uGrayLight text-sm bg-uGray/5"
                      )}
                    >
                      <p className="font-semibold col-span-1">QUESTION</p>
                      <p className="col-span-6 font-mono truncate">
                        {question!}
                      </p>
                      <p className="font-semibold col-span-1">ANSWER</p>
                      <p className="col-span-6 font-mono">{answer}</p>
                    </div>

                    {/* Gradient overlay inside scrollable box */}
                    <div
                      className={clsx(
                        "pointer-events-none absolute bottom-0 left-0 right-0 h-6",
                        "bg-gradient-to-t from-background via-background/80 to-transparent",
                        "rounded-b-md"
                      )}
                    />
                  </div>
                  <div className="flex flex-row gap-4 items-center justify-end  ">
                    <p className="text-uGrayLight text-base italic">
                      Not satisfied with the score?
                    </p>
                    <Button
                      title="Evaluate Again"
                      onClick={() => onClose({ re_evaluate: true })}
                    />
                  </div>
                </div>
              </DropDown>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalResult;
