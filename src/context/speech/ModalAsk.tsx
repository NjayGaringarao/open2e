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
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();
  const grayColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--uGrayLight")
    .trim();

  const handleClose = () => {
    stopListening();
    askResolve?.(null);
    setAskPrompt(null);
  };

  return (
    <BaseModal
      isOpen={!!askPrompt}
      onClose={handleClose}
      panelClassName="w-[26rem] flex flex-col gap-4 items-center py-6"
      contentClassName="gap-4 items-center py-2"
      disableBackdropClick={true}
    >
      {/* Voice Visualizer active only while listening */}
      <div className="">
        <p className="text-base font-semibold text-uGray text-start px-6">
          Question:
        </p>
        <p className="text-base text-uGray text-start px-6">{askPrompt}</p>
      </div>

      <div className="relative bg-panel rounded-md overflow-hidden">
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
        <div className="bottom-0 absolute bg-background py-8 w-full flex flex-col items-center border-t border-uGrayLightLight">
          <Button
            title="Stop Listening"
            onClick={handleClose}
            className="bg-uRed py-2"
          />
        </div>
      </div>
    </BaseModal>
  );
}
