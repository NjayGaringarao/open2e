import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { VoiceVisualizer } from "react-voice-visualizer";
import Button from "@/components/Button";
import clsx from "clsx";
interface prop {
  isListening: boolean;
  recorderControls: any;
  stopListening: () => void;
}

export function ModalListen({
  isListening,
  recorderControls,
  stopListening,
}: prop) {
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();
  const grayColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--uGrayLight")
    .trim();

  return (
    <Transition appear show={isListening} as={Fragment}>
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
            <DialogPanel
              className={clsx(
                "relative w-[26rem] transform overflow-hidden",
                "rounded-lg bg-background text-left align-middle shadow-xl transition-all ",
                "flex flex-col gap-4 items-center py-6"
              )}
            >
              {/* Voice Visualizer active only while listening */}

              <div className="relative border">
                {isListening && (
                  <VoiceVisualizer
                    controls={recorderControls}
                    height={150}
                    width={370}
                    barWidth={4}
                    mainBarColor={primaryColor}
                    secondaryBarColor={grayColor}
                  />
                )}
                <div className="bottom-0 absolute bg-background py-8 w-full flex flex-col items-center border">
                  <Button
                    title="Stop Listening"
                    onClick={stopListening}
                    className="bg-uRed py-2"
                  />
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
