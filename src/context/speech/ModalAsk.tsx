import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { VoiceVisualizer } from "react-voice-visualizer";
import Button from "@/components/Button";

interface prop {
  askPrompt: string | null;
  isListening: boolean;
  recorderControls: any;
  stopListening: () => void;
  askResolve?: (param: boolean | null) => void;
  setAskPrompt: (askPrompt: string | null) => void;
}

export function ModalAsk({
  askPrompt,
  isListening,
  recorderControls,
  stopListening,
  askResolve,
  setAskPrompt,
}: prop) {
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();
  const grayColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--uGrayLight")
    .trim();
  return (
    <Transition appear show={!!askPrompt} as={Fragment}>
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
          />
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
            <DialogPanel className=" relative w-[26rem] transform overflow-hidden rounded-lg bg-background text-left align-middle shadow-xl transition-all flex flex-col pt-4 gap-4 items-center">
              {/* Voice Visualizer active only while listening */}
              <div className="items-start mt-4">
                <p className="text-lg font-semibold text-uGray text-start px-4">
                  Question:
                </p>
                <p className="text-base text-uGray text-start px-4">
                  {askPrompt}
                </p>
              </div>
              {isListening && (
                <VoiceVisualizer
                  controls={recorderControls}
                  height={150}
                  barWidth={4}
                  mainBarColor={primaryColor}
                  secondaryBarColor={grayColor}
                />
              )}

              <div className="bottom-8 absolute bg-background py-8 w-full flex flex-col items-center border">
                <Button
                  title="Cancel"
                  onClick={() => {
                    stopListening();
                    askResolve?.(null);
                    setAskPrompt(null);
                  }}
                  className="bg-uRed py-2"
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
