import React, { useEffect, useState } from "react";
import { detectAI } from "@/lib/sapling/detection"; // adjust path if needed
import clsx from "clsx";
import { LearnerSheetData } from "@/types/evaluation/learner";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

interface IAIDetection {
  text: string;
  className?: string;
  sheet: LearnerSheetData;
  setSheet: React.Dispatch<React.SetStateAction<LearnerSheetData>>;
}

const AIDetection = ({ text, className, sheet, setSheet }: IAIDetection) => {
  const { status } = useConnectionStatus();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runDetection = async () => {
    if (status === "OFFLINE") {
      setMessage("");
      return;
    }
    setLoading(true);
    setError("");
    setSheet((prev) => ({ ...prev, detectedAI: undefined }));
    setMessage("");

    const { percent, message, error } = await detectAI(text);

    console.log({ percent, message, error });
    if (error) {
      setError(error);
    } else {
      setSheet((prev) => ({ ...prev, detectedAI: percent }));
      if (message) setMessage(message);
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
