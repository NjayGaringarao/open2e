import { VoiceVisualizer } from "react-voice-visualizer";
import Button from "@/components/Button";
import BaseModal from "@/components/container/BaseModal";

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
  // Speech UI removed
  export default function ModalAsk() {
    return null;
  }
}
