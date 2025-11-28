import React from "react";
import Image from "next/image";
import {
  EULA_URL,
  GITHUB_REPOSITORY,
  LICENSE_URL,
  USER_MANUAL_URL,
} from "@/constant/env";
const Footer = () => {
  return (
    <footer className="bg-[#0a0f18] text-[#eaeef4] py-12 px-4 border-t border-[#2a313c]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/icon/open2e.png"
                alt="Open2E"
                width={38}
                height={38}
              />
              <span className="text-2xl font-bold text-primary">Open2E</span>
            </div>
            <p className="text-[#c5cad3]">
              Open Ended Evaluation for Computer Literacy.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#eaeef4]">Product</h4>
            <ul className="space-y-2 text-[#c5cad3]">
              <li>
                <a
                  href="#features"
                  className="hover:text-[#ffc131] transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#download"
                  className="hover:text-[#ffc131] transition-colors"
                >
                  Download
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#eaeef4]">Resources</h4>
            <ul className="space-y-2 text-[#c5cad3]">
              <li>
                <a
                  href={USER_MANUAL_URL}
                  className="hover:text-[#ffc131] transition-colors"
                >
                  User Manual
                </a>
              </li>

              <li>
                <a
                  href={GITHUB_REPOSITORY}
                  className="hover:text-[#ffc131] transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#eaeef4]">Legal</h4>
            <ul className="space-y-2 text-[#c5cad3]">
              <li>
                <a
                  href={EULA_URL}
                  className="hover:text-[#ffc131] transition-colors"
                >
                  End User License Agreement
                </a>
              </li>
              <li>
                <a
                  href={LICENSE_URL}
                  className="hover:text-[#ffc131] transition-colors"
                >
                  License
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2a313c] pt-8 text-center text-[#c5cad3]">
          <p className="text-base text-[#c5cad3]">
            For academic thesis purposes only. Not for commercial use. No rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
