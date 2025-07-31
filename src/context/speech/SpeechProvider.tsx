import React, { Fragment, useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { SpeechContext } from "./SpeechContext";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import Button from "@/components/Button";
import { useSettings } from "../main/settings";

export const SpeechProvider = ({ children }: { children: React.ReactNode }) => {
  const { ttsConfig } = useSettings();
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();
  const grayColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--uGrayLight")
    .trim();
  const [isListening, setIsListening] = useState(false);
  const [resolving, setResolving] = useState<(value: string) => void>();
  const { transcript, resetTranscript } = useSpeechRecognition();
  const recorderControls = useVoiceVisualizer();

  const talk = async (text: string): Promise<void> => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Voice Setup
    utterance.rate = ttsConfig.rate;
    utterance.pitch = ttsConfig.pitch;
    utterance.volume = ttsConfig.volume;
    utterance.voice = voices[ttsConfig.voiceIndex];

    await new Promise<void>((resolve) => {
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const listen = async (): Promise<string> => {
    return await new Promise<string>((resolve) => {
      resetTranscript();
      setIsListening(true);
      setResolving(() => resolve);
      SpeechRecognition.startListening({ continuous: true });
      recorderControls.startRecording();
    });
  };

  useEffect(() => {
    if (!isListening) return;

    const timeout = setTimeout(() => {
      if (transcript.trim().length === 0) {
        stopListening();
        resolving?.("");
      }
    }, 10000); // 10 seconds of silence

    return () => clearTimeout(timeout);
  }, [transcript, isListening]);

  const stopListening = () => {
    SpeechRecognition.stopListening();
    recorderControls.stopRecording();
    setIsListening(false);
    recorderControls.recordedBlob = null;
    resolving?.(transcript);
  };

  return (
    <SpeechContext.Provider value={{ talk, listen }}>
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
              <DialogPanel className=" relative w-[26rem] transform overflow-hidden rounded-lg bg-background text-left align-middle shadow-xl transition-all flex flex-col pt-4 gap-4 items-center">
                {/* Voice Visualizer active only while listening */}

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
                    title="Stop Listening"
                    onClick={stopListening}
                    className="bg-uRed py-2"
                  />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
      {children}
    </SpeechContext.Provider>
  );
};
