import React from "react";
import Image from "next/image";
import { GITHUB_REPOSITORY } from "@/constant/env";
const HeroSection = () => {
  return (
    <section className="px-6 h-screen flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto">
        <div className="text-start md:text-center">
          <div className="flex flex-row gap-2 lg:gap-4 items-center mb-6 justify-start md:justify-center ">
            <Image
              src={"/icon/open2e.png"}
              alt={"Logo"}
              width={250}
              height={250}
              className="h-20 w-20 lg:h-32 lg:w-32"
            />
            <p className="text-6xl md:text-7xl lg:text-8xl text-primary font-semibold">
              Open2E
            </p>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-[#c5cad3] mb-8 max-w-3xl mx-auto leading-relaxed">
            Automated Evaluation of Open-ended Response using Artificial
            Intelligence: GPT4o and Phi4-mini LLMs
          </p>
          <div className="absolute bottom-8 right-0 left-0 text-center">
            <div className=" flex flex-col sm:flex-row gap-4 justify-center items-center text-center">
              <a
                href="#download"
                className="w-60 bg-gradient-to-r from-[#ffc131] to-[#e6a91d] text-[#0d1117] py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-[#ffc131]/30 transition-all transform hover:scale-105"
              >
                Download Now
              </a>
              <a
                href={GITHUB_REPOSITORY}
                target="_blank"
                rel="noopener noreferrer"
                className="w-60 border-2 border-[#2a313c] text-[#eaeef4] px-8 py-4 rounded-xl text-lg font-semibold hover:border-[#ffc131] hover:text-[#ffc131] transition-all"
              >
                View on GitHub
              </a>
            </div>
            <p className="text-sm text-[#c5cad3] mt-4">
              Windows 11 • 4GB RAM minimum • Free & Open Source
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
