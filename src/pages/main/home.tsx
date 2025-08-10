import { useDialog } from "@/context/dialog/useDialog";
import { useSpeech } from "@/context/speech";

import { title } from "process";
import { useState } from "react";
import Markdown from "react-markdown";

export default function Home() {
  const [val, setVal] = useState("");
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
    <div>
      <h2 className="text-2xl font-bold text-uGray mb-4 gap-6">Home</h2>
      <p>Welcome to Opene! This is the dashboard.</p>
      <button
        onClick={async () => {
          await listen();
        }}
      >
        Talk
      </button>

      <button
        onClick={async () => {
          await ask(
            "Are you interested about this topic? Please answer in Yes or No."
          );
        }}
      >
        Ask
      </button>

      <button
        onClick={async () => {
          await alert({
            title: "Test",
            description: "This is jus a test fasnf asdfkasdnf.",
          });
        }}
      >
        Confirm
      </button>

      <Markdown>{markdown}</Markdown>
      <input value={val} onChange={(e) => setVal(e.target.value)} />
    </div>
  );
}
