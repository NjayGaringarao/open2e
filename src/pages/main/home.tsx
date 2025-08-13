import { useDialog } from "@/context/dialog/useDialog";
import { useSpeech } from "@/context/speech";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { useState } from "react";
import Markdown from "react-markdown";

export default function Home() {
  const [val, setVal] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(true);
  const { talk, ask, listen } = useSpeech();
  const { alert, confirm } = useDialog();

  const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-uGray mb-4">Home</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
          </button>
        </div>
      </div>

      {showAnalytics ? (
        <AnalyticsDashboard />
      ) : (
        <div className="space-y-4">
          <p>Welcome to Opene! This is the dashboard.</p>
          <div className="flex space-x-2">
            <button
              onClick={async () => {
                await listen();
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Talk
            </button>

            <button
              onClick={async () => {
                await ask(
                  "Are you interested about this topic? Please answer in Yes or No."
                );
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Ask
            </button>

            <button
              onClick={async () => {
                await alert({
                  title: "Test",
                  description: "This is just a test.",
                });
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Confirm
            </button>
          </div>

          <Markdown>{markdown}</Markdown>
          <input 
            value={val} 
            onChange={(e) => setVal(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
