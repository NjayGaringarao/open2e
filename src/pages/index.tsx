import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import icon from "../constant/icon";
import "../global.css";

const Index = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-8 animate-fadeIn">
      <div className="flex flex-row gap-4 justify-center items-center mb-16">
        <img
          src={icon.logo}
          className="h-44 w-44 lg:h-52 lg:w-52 2xl:h-64 2xl:w-64 rounded-full hover:shadow-[0_0_24px_var(--primary)]"
        />

        <div className="flex flex-col">
          <p className="text-8xl lg:text-9xl 2xl:text-[10rem] font-bold text-primary">
            Open2E
          </p>
          <p className="text-textBody text-base lg:text-lg 2xl:text-xl bg-background font-mono">
            Automated Evaluation of Open Ended Response
          </p>
          <div className="flex flex-row text-textBody text-base lg:text-lg 2xl:text-xl bg-background font-mono">
            for Basic Computer Literacy.
            <div className="w-3 h-[1.2em] bg-textBody animate-blink border"></div>
          </div>
        </div>
      </div>

      <div className="absolute right-8 bottom-8">
        <Link
          className="border border-primary flex flex-row py-4 px-8 rounded-xl text-textHeader text-xl font-semibold"
          to="/home"
        >
          Get Started
          <ChevronRight className="ml-2" color="var(--textHeader)" />
        </Link>
      </div>
    </div>
  );
};

export default Index;
