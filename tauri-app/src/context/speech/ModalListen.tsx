import { VoiceVisualizer } from "react-voice-visualizer";
import Button from "@/components/Button";
import BaseModal from "@/components/container/BaseModal";
interface prop {
  isListening: boolean;
  recorderControls: any;
  stopListening: () => void;
  isSupported?: boolean;
}

export function ModalListen({
  isListening,
  recorderControls,
  stopListening,
  isSupported = true,
}: prop) {
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();
  const grayColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--uGrayLight")
    .trim();

  return (
    <BaseModal
      isOpen={isListening}
      onClose={stopListening}
      panelClassName="w-[26rem] flex flex-col gap-4 items-center py-6"
      contentClassName="gap-4 items-center"
      disableBackdropClick={true}
    >
      {/* Voice Visualizer active only while listening */}
      <div className="relative">
        {!isSupported ? (
          <div className="h-[150px] w-[370px] flex items-center justify-center bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-center">
              Speech recognition is not supported in this browser.
              <br />
              Please use a modern browser like Chrome, Edge, or Safari.
            </p>
          </div>
        ) : isListening ? (
          <VoiceVisualizer
            controls={recorderControls}
            height={150}
            width={370}
            barWidth={4}
            mainBarColor={primaryColor}
            secondaryBarColor={grayColor}
          />
        ) : (
          <div className="h-[150px] w-[370px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-uGrayLight mb-2">
                Starting voice recognition...
              </p>
              <p className="text-sm text-uGrayLight">
                Please allow microphone access when prompted
              </p>
            </div>
          </div>
        )}
        <div className="bottom-0 absolute bg-background py-8 w-full flex flex-col items-center border-t border-uGrayLightLight">
          <Button
            title="Stop Listening"
            onClick={stopListening}
            className="bg-uRed py-2"
          />
        </div>
      </div>
    </BaseModal>
  );
}
