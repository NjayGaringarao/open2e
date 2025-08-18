import "@/global.css";
import icon from "@/constant/icon";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Loading from "@/components/Loading";

const rotatingNames = [
  <p className="text-uGrayLight animate-fadeIn">
    Alyssa Jane P. Marquez [Principal Investigator]
  </p>,
  <p className="text-uGrayLight animate-fadeIn">
    Niño Jr V. Garingarao [Software Engineer]
  </p>,
  <p className="text-uGrayLight animate-fadeIn">
    John Paul C. Marquez [Research & Development Support]
  </p>,
];

const Index = () => {
  const fullText =
    "  Automated Evaluation of Open Ended Response for Basic Computer Literacy.";
  const [displayedText, setDisplayedText] = useState("");

  const [nameIndex, setNameIndex] = useState(0); // <- store index, not JSX

  useEffect(() => {
    const interval = setInterval(() => {
      setNameIndex((prev) => (prev + 1) % rotatingNames.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) =>
        fullText[index] ? prev + fullText[index] : prev
      );
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 30); // adjust speed here

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      invoke("show_window");
    }, 6000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={clsx(
        "h-screen w-screen bg-background text-uGray flex items-center justify-center overflow-hidden",
        "relative p-6"
      )}
      data-tauri-drag-region
    >
      <div className="absolute inset-0 pointer-events-none bg-radial-glow" />
      <div className="absolute inset-0 opacity-[0.25] [background-size:24px_24px] bg-grid" />

      <div className="flex flex-row gap-8 items-center">
        <img
          src={icon.logo}
          className="h-44 w-44 rounded-full animate-float shadow-glow"
        />
        <div className="flex flex-col">
          <p className="text-7xl lg:text-8xl 2xl:text-9xl font-extrabold tracking-tight text-primary drop-shadow">
            Open2E
          </p>
          <p className="mt-2 text-uGrayLight text-base w-[28rem] max-w-[80vw] font-mono/relaxed">
            {displayedText}
            <span className="w-[0.5ch] h-[1.2em] ml-[1px] bg-uGrayLight animate-blink align-baseline">|</span>
          </p>
        </div>
      </div>

      <Loading classname="absolute bottom-6 right-6" size="small" />
      <div className="absolute bottom-6 left-6 text-uGrayLight text-sm font-mono">
        {rotatingNames[nameIndex]}
      </div>

      <div data-tauri-drag-region className="absolute inset-0" />
    </div>
  );
};

export default Index;
