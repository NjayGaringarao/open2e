import { useSettings } from "@/context/main/settings";
import React, { useEffect, useState } from "react";
import { detectAI } from "@/lib/sapling/detection"; // adjust path if needed
import clsx from "clsx";
import { LearnerSheetData } from "@/types/evaluation/learner";

interface IAIDetection {
  text: string;
  className?: string;
  sheet: LearnerSheetData;
  setSheet: React.Dispatch<React.SetStateAction<LearnerSheetData>>;
}

const AIDetection = ({ text, className, sheet, setSheet }: IAIDetection) => {
  const { saplingAPIKey } = useSettings();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runDetection = async () => {
    setLoading(true);
    setError("");
    setSheet((prev) => ({ ...prev, detectedAI: undefined }));
    setMessage("");

    const result = await detectAI(text, saplingAPIKey);

    if (result.error) {
      setError(result.error);
    } else {
      setSheet((prev) => ({ ...prev, detectedAI: result.percent }));
      if (result.message) setMessage(result.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (text.trim().length > 0) {
      runDetection();
    }
  }, [text]);

  return (
    <div className={clsx("flex flex-col gap-2 w-full", className)}>
      {loading ? (
        <p className="text-sm text-uGrayLight">Detecting AI usage...</p>
      ) : error ? (
        <p className="text-sm text-uRed">Error: {error}</p>
      ) : (
        <>
          {/* {sheet.detectedAI && (
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
          )} */}
          {message && sheet.committedAnswer === sheet.trackedAnswer && (
            <p className="text-sm text-uGrayLight italic">{message}</p>
          )}
        </>
      )}
    </div>
  );
};

export default AIDetection;
