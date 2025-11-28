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
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const recorderControls = useVoiceVisualizer();

  const [isListening, setIsListening] = useState(false);
  const [askPrompt, setAskPrompt] = useState<string | null>(null);
  const [askResolve, setAskResolve] =
    useState<(value: boolean | null) => void>();
  const [resolving, setResolving] = useState<(value: string) => void>();
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Check browser support
  const isSupported =
    browserSupportsSpeechRecognition && isSpeechRecognitionSupported();

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
    if (!isSupported) {
      setSpeechError("Speech recognition is not supported in this browser");
      return;
    }

    try {
      setSpeechError(null);
      resetTranscript();
      setIsListening(true);

      // Request microphone permission first
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          SpeechRecognition.startListening({
            continuous: true,
            language: "en-US",
            interimResults: true,
          });
          recorderControls.startRecording();
        })
        .catch((error) => {
          console.error("Microphone permission denied:", error);
          setSpeechError("Microphone permission is required for voice input");
          setIsListening(false);
        });
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setSpeechError("Failed to start speech recognition");
      setIsListening(false);
    }
  }, [recorderControls, resetTranscript, isSupported]);

  const stopListening = useCallback(() => {
    try {
      SpeechRecognition.stopListening();
      recorderControls.stopRecording();
      setIsListening(false);
      recorderControls.recordedBlob = null;

      // Use the transcript from the hook instead of the state
      const finalTranscript = transcript.trim();
      console.log("Speech recognition result:", finalTranscript);

      if (resolving) {
        // Clear timeout if it exists
        if ((resolving as any).timeout) {
          clearTimeout((resolving as any).timeout);
        }
        resolving(finalTranscript);
        setResolving(undefined);
      }
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
      setSpeechError("Failed to stop speech recognition");
      if (resolving) {
        // Clear timeout if it exists
        if ((resolving as any).timeout) {
          clearTimeout((resolving as any).timeout);
        }
        resolving("");
        setResolving(undefined);
      }
    }
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
    if (!isSupported) {
      console.error("Speech recognition not supported");
      return "";
    }

    return new Promise((resolve) => {
      console.log("Starting voice input...");
      setResolving(() => resolve);
      startListening();

      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        console.log("Voice input timeout, stopping...");
        stopListening();
        resolve("");
      }, 30000); // 30 second timeout

      // Store timeout reference to clear it when speech completes
      (resolve as any).timeout = timeout;
    });
  };

  // Add debugging for speech recognition
  useEffect(() => {
    console.log("Speech recognition state:", {
      isListening,
      listening,
      transcript: transcript.substring(0, 50) + "...",
      isSupported,
      speechError,
    });
  }, [isListening, listening, transcript, isSupported, speechError]);

  // Handle speech recognition errors
  useEffect(() => {
    if (speechError) {
      console.error("Speech recognition error:", speechError);
      if (resolving) {
        resolving("");
        setResolving(undefined);
      }
    }
  }, [speechError, resolving]);

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
