import { useSpeech } from "@/context/speech";
import { useState } from "react";

export default function Home() {
  const [val, setVal] = useState("");
  const { talk } = useSpeech();
  return (
    <div>
      <h2 className="text-2xl font-bold text-uGray mb-4">Home</h2>
      <p>Welcome to Opene! This is the dashboard.</p>
      <button
        onClick={async () => {
          await talk("Hello Njay! Welcome to Open two e");
        }}
      >
        Talk
      </button>
      <input value={val} onChange={(e) => setVal(e.target.value)} />
    </div>
  );
}
