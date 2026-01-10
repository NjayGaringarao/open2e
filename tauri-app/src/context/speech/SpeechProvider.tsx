/*
import React, { useState, useEffect, useCallback } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useVoiceVisualizer } from "react-voice-visualizer";

import { ModalAsk } from "./ModalAsk";
import { ModalListen } from "./ModalListen";
import { SpeechContext } from "./SpeechContext";
import { useSettings } from "../main/settings";

// Check if speech recognition is supported
const isSpeechRecognitionSupported = () => {
  return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
};
*/

import React from "react";

export const SpeechProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

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
  const {
    transcript,
    resetTranscript,
    listening,
    import React from "react";

    // No-op provider: speech functionality removed
    export const SpeechProvider = ({ children }: { children: React.ReactNode }) => {
      return <>{children}</>;
    };
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
      value={{
        talk,
        cancelTalk,
        listen: isSupported
          ? listen
          : async () => {
              console.warn("Speech recognition not supported");
              return "";
            },
        ask: isSupported
          ? ask
          : async () => {
              console.warn("Speech recognition not supported");
              return null;
            },
        cancelAsk,
      }}
    >
      <ModalListen
        isListening={isListening}
        recorderControls={recorderControls}
        stopListening={stopListening}
        isSupported={isSupported}
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
