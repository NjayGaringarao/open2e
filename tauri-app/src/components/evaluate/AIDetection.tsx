import React, { useEffect, useState } from "react";
import { detectAI } from "@/lib/sapling/detection";
import clsx from "clsx";
import { SheetData } from "@/types/evaluation";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import ModalAIDetection from "./ModalAIDetection";
import { Info } from "lucide-react";
import Button from "../Button";

interface IAIDetection {
  text: string;
  className?: string;
  sheet: SheetData;
  setSheet: React.Dispatch<React.SetStateAction<SheetData>>;
}

const AIDetection = ({ text, className, sheet, setSheet }: IAIDetection) => {
  const { status } = useConnectionStatus();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const runDetection = async () => {
    if (status === "OFFLINE") {
      setMessage("");
      return;
    }
    setLoading(true);
    setError("");
    setSheet((prev) => ({
      ...prev,
      detectedAI: undefined,
      aiDetectionData: undefined,
    }));
    setMessage("");

    const detectionResult = await detectAI(text);

    console.log(detectionResult);
    if (detectionResult.error) {
      setError(detectionResult.error);
    } else {
      const percent = Math.round(detectionResult.overall_score * 100);
      setSheet((prev) => ({
        ...prev,
        detectedAI: percent,
        aiDetectionData: detectionResult,
      }));
      if (detectionResult.message) setMessage(detectionResult.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (text.trim().length > 0) {
      runDetection();
    }
  }, [text]);

  return (
    <div
      className={clsx(
        "flex flex-col gap-2 w-full",
        className,
        status === "OFFLINE" && "hidden"
      )}
    >
      <p className="text-xl text-uGrayLight font-semibold mt-4">
        AI Detection Score
      </p>
      {loading ? (
        <p className="text-sm text-uGrayLight">Detecting AI usage...</p>
      ) : error ? (
        <p className="text-sm text-uRed">Error: {error}</p>
      ) : (
        <>
          {sheet.detectedAI !== undefined && (
            <div className="flex items-center gap-3">
              <div className="w-full bg-gray-200 h-6 rounded overflow-hidden">
                <div
                  className={`h-full text-background text-sm font-semibold flex items-center justify-center transition-all duration-300 ${
                    sheet.detectedAI >= 85
                      ? "bg-red-500"
                      : sheet.detectedAI >= 60
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${sheet.detectedAI < 5 ? 5 : sheet.detectedAI}%`,
                  }}
                >
                  {sheet.detectedAI}%
                </div>
              </div>
              {sheet.aiDetectionData && (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-48"
                  title="View   Analysis"
                >
                  <Info className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
          {message && sheet.committedAnswer === sheet.trackedAnswer && (
            <p className="text-sm text-uGrayLight italic">{message}</p>
          )}
        </>
      )}

      <ModalAIDetection
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aiDetectionData={sheet.aiDetectionData || null}
      />
    </div>
  );
};

export default AIDetection;
