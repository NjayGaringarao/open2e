import { useState } from "react";

export default function Home() {
  const [val, setVal] = useState("");
  return (
    <div>
      <h2 className="text-2xl font-bold text-uGray mb-4">Home</h2>
      <p>Welcome to Opene! This is the dashboard.</p>
      <input value={val} onChange={(e) => setVal(e.target.value)} />
    </div>
  );
}
