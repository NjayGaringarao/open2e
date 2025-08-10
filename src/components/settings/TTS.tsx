import { useEffect, useState } from "react";
import Select from "../Select";
import Slider from "../Slider";
import Button from "../Button";
import { useDialog } from "@/context/dialog";
import { toaster } from "@/components/ui/toaster";
import { useSettings } from "@/context/main/settings";

const TTS = () => {
  const { confirm } = useDialog();
  const { ttsConfig, update } = useSettings();

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selection, setSelection] = useState(ttsConfig.voiceIndex ?? 0);
  const [rate, setRate] = useState(ttsConfig.rate ?? 0.8);
  const [pitch, setPitch] = useState(ttsConfig.pitch ?? 0.9);
  const [volume, setVolume] = useState(ttsConfig.volume ?? 1);
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  useEffect(() => {
    const changed =
      rate !== ttsConfig.rate ||
      pitch !== ttsConfig.pitch ||
      volume !== ttsConfig.volume ||
      selection !== ttsConfig.voiceIndex;
    setIsModified(changed);
  }, [rate, pitch, volume, selection, ttsConfig]);

  const handleReset = () => {
    setRate(ttsConfig.rate);
    setPitch(ttsConfig.pitch);
    setVolume(ttsConfig.volume);
    setSelection(ttsConfig.voiceIndex);
  };

  const handleUpdate = async () => {
    const confirmed = await confirm({
      title: "Apply Voice Settings?",
      description: "This will store and preview your TTS settings.",
    });

    if (!confirmed) return;

    try {
      setIsLoading(true);

      const utterance = new SpeechSynthesisUtterance(
        "This is your configured voice preview."
      );
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      utterance.voice = voices[selection] ?? voices[0];

      window.speechSynthesis.speak(utterance);

      await update({
        ttsConfig: { rate, pitch, volume, voiceIndex: selection },
      });

      toaster.create({
        title: "Voice Applied",
        description: "Settings saved and preview is speaking.",
        type: "success",
      });
    } catch {
      toaster.create({
        title: "Error",
        description: "Could not apply voice settings.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="grid grid-cols-3 gap-4">
        <Select
          value={selection}
          onChange={(e) => setSelection(Number(e.target.value))}
          className=" text-lg line-clamp-2 mb-4 text-wrap"
        >
          {voices.map((voice, i) => (
            <option key={voice.name} value={i}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </Select>
        <div className="col-span-2">
          <Slider
            label="Rate"
            value={rate}
            min={0.1}
            max={10}
            step={0.1}
            onChange={setRate}
          />
          <Slider
            label="Pitch"
            value={pitch}
            min={0}
            max={2}
            step={0.01}
            onChange={setPitch}
          />
          <Slider
            label="Volume"
            value={volume}
            min={0}
            max={1}
            step={0.01}
            onChange={setVolume}
          />
        </div>
      </div>

      {isModified && (
        <div className="w-full flex justify-end gap-4">
          <Button
            title="Update"
            onClick={handleUpdate}
            disabled={isLoading}
            className="w-24"
          />
          <Button
            title="Reset"
            onClick={handleReset}
            disabled={isLoading}
            className="w-24"
            secondary
          />
        </div>
      )}
    </div>
  );
};

export default TTS;
