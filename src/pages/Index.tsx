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
        "h-screen w-screen bg-background p-4 sm:p-8 border-4 border-primary",
        "flex flex-col items-center justify-center",
        "dark:bg-backgroundDark dark:border-primaryDark",
        "animate-fadeIn"
      )}
      data-tauri-drag-region
    >
      <div className="flex flex-row gap-4 justify-center items-center">
        <img
          src={icon.logo}
          className="h-44 w-44 rounded-full shadow-[0_0_24px_var(--primary)] animate-bounce"
        />
        <div className="flex flex-col">
          <p className="text-8xl lg:text-9xl 2xl:text-[10rem] font-bold text-primary">
            Open2E
          </p>
          <p className="text-uGrayLight text-base w-96 bg-background font-mono">
            {displayedText}
            <span className="w-[0.5ch] h-[1.2em] ml-[1px] bg-uGrayLight animate-blink">
              |
            </span>
          </p>
        </div>
        <Loading classname="absolute bottom-8 right-8" size="small" />
        <div className="absolute bottom-8 left-8 text-uGrayLight text-base font-mono">
          {rotatingNames[nameIndex]}
        </div>
      </div>

      <div data-tauri-drag-region className="absolute h-screen w-screen" />
    </div>
  );
};

export default Index;
