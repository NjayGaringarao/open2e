import React, { useState, useEffect, useCallback } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useVoiceVisualizer } from "react-voice-visualizer";

import { ModalAsk } from "./ModalAsk";
import { ModalListen } from "./ModalListen";
import { SpeechContext } from "./SpeechContext";
import { useSettings } from "../main/settings";

const POSITIVE_ANSWERS = [
  "yes",
  "yeah",
  "yep",
  "affirmative",
  "certainly",
  "definitely",
];
const NEGATIVE_ANSWERS = ["no", "nope", "nah", "negative"];

export const SpeechProvider = ({ children }: { children: React.ReactNode }) => {
  const { ttsConfig } = useSettings();
  const { transcript, resetTranscript } = useSpeechRecognition();
  const recorderControls = useVoiceVisualizer();

  const [isListening, setIsListening] = useState(false);
  const [askPrompt, setAskPrompt] = useState<string | null>(null);
  const [askResolve, setAskResolve] =
    useState<(value: boolean | null) => void>();
  const [resolving, setResolving] = useState<(value: string) => void>();

  const cancelTalk = () => window.speechSynthesis.cancel();

  const talk = async (text: string): Promise<void> => {
    cancelTalk();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    utterance.voice = voices[ttsConfig.voiceIndex];
    utterance.rate = ttsConfig.rate;
    utterance.pitch = ttsConfig.pitch;
    utterance.volume = ttsConfig.volume;

    return new Promise((resolve) => {
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const startListening = useCallback(() => {
    resetTranscript();
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true });
    recorderControls.startRecording();
  }, [recorderControls, resetTranscript]);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
    recorderControls.stopRecording();
    setIsListening(false);
    recorderControls.recordedBlob = null;
    if (resolving) resolving(transcript);
  }, [recorderControls, resolving, transcript]);

  const ask = async (question: string): Promise<boolean | null> => {
    cancelTalk();
    await talk(question);

    return new Promise((resolve) => {
      setAskPrompt(question);
      setAskResolve(() => resolve);
      startListening();
    });
  };

  const cancelAsk = () => {
    cancelTalk();
    stopListening();
    askResolve?.(null);
    setAskPrompt(null);
  };

  const listen = async (): Promise<string> => {
    return new Promise((resolve) => {
      setResolving(() => resolve);
      startListening();
    });
  };

  useEffect(() => {
    if (!isListening || !askPrompt) return;

    const normalized = transcript.trim().toLowerCase();
    const matched = POSITIVE_ANSWERS.includes(normalized)
      ? true
      : NEGATIVE_ANSWERS.includes(normalized)
      ? false
      : null;

    if (matched !== null) {
      stopListening();
      askResolve?.(matched);
      setAskPrompt(null);
      return;
    }

    const timeout = setTimeout(() => {
      stopListening();
      askResolve?.(null);
      setAskPrompt(null);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [transcript, isListening, askPrompt, stopListening, askResolve]);

  return (
    <SpeechContext.Provider
      value={{ talk, cancelTalk, listen, ask, cancelAsk }}
    >
      <ModalListen
        isListening={isListening}
        recorderControls={recorderControls}
        stopListening={stopListening}
      />
      <ModalAsk
        askPrompt={askPrompt}
        isListening={isListening}
        recorderControls={recorderControls}
        stopListening={stopListening}
        askResolve={askResolve}
        setAskPrompt={setAskPrompt}
      />
      {children}
    </SpeechContext.Provider>
  );
};
