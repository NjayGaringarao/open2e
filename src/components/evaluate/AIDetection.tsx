import { useSettings } from "@/context/main/settings";
import { useEffect, useState } from "react";
import { detectAI } from "@/lib/sapling/detection"; // adjust path if needed
import clsx from "clsx";

interface IAIDetection {
  text: string;
  className?: string;
}

const AIDetection = ({ text, className }: IAIDetection) => {
  const { saplingAPIKey } = useSettings();
  const [percent, setPercent] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runDetection = async () => {
    setLoading(true);
    setError("");
    setPercent(0);
    setMessage("");

    const result = await detectAI(text, saplingAPIKey);

    if (result.error) {
      setError(result.error);
    } else {
      setPercent(result.percent);
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
          <div className="w-full bg-gray-200 h-6 rounded overflow-hidden">
            <div
              className={`h-full text-background text-sm font-semibold flex items-center justify-center transition-all duration-300 ${
                percent >= 85
                  ? "bg-red-500"
                  : percent >= 60
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${percent < 5 ? 5 : percent}%` }}
            >
              {percent}%
            </div>
          </div>
          {message && (
            <p className="text-sm text-uGrayLight italic">{message}</p>
          )}
        </>
      )}
    </div>
  );
};

export default AIDetection;
