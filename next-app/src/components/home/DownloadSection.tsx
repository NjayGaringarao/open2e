import {
  APP_VERSION,
  DEVELOPMENT_STAGE,
  GITHUB_REPOSITORY,
  DOWNLOAD_URL,
} from "@/constant/env";
import React from "react";
import Image from "next/image";
import {
  AppWindow,
  Cpu,
  Globe,
  Gpu,
  HardDrive,
  MemoryStick,
} from "lucide-react";

const DownloadSection = () => {
  return (
    <section
      id="download"
      className="py-20 px-4 bg-gradient-to-br from-[#ffc131] to-[#e6a91d]"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-2 text-[#0d1117]">
          Ready to Transform Your Evaluation Process?
        </h2>
        <p className="text-xl mb-8 text-[#0d1117]/80">
          Download Open2E today and experience the future of computer literacy
          assessment.
        </p>

        <div className="bg-[#0d1117]/10 backdrop-blur-sm rounded-2xl p-4 md:p-8 mb-8 border border-[#0d1117]/20">
          <p className="text-2xl font-bold mb-4 text-[#0d1117] w-full text-start">
            System Requirements
          </p>
          <div className="overflow-x-auto mb-8 rounded-2xl">
            <table className="w-full text-left border-collapse overflow-hidden bg-white/80">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-[#0d1117] text-[#ffc131] font-bold text-base">
                    Specification
                  </th>
                  <th className="px-6 py-3 bg-[#ffc131]/70 text-[#0d1117] font-bold text-base">
                    Minimum
                  </th>
                  <th className="px-6 py-3 bg-[#ffc131]/60 text-[#0d1117] font-bold text-base">
                    Recommended
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* OS */}
                <tr className="border-b border-[#0d1117]/10">
                  <td className="px-6 py-4 flex items-center gap-2 font-medium text-[#0d1117]">
                    <AppWindow className="inline-block h-8 w-8 mr-2 text-[#0d1117]" />
                    Operating System
                  </td>
                  <td className="px-6 py-4 text-[#0d1117]/90">
                    Windows 11 Home
                  </td>
                  <td className="px-6 py-4 text-[#0d1117]/90">
                    Windows 11 Enterprise
                  </td>
                </tr>
                {/** CPU */}
                <tr className="border-b border-[#0d1117]/10">
                  <td className="px-6 py-4 flex items-center gap-2 font-medium text-[#0d1117]">
                    <Cpu className="inline-block h-8 w-8 mr-2 text-[#0d1117]" />
                    CPU
                  </td>
                  <td className="px-6 py-4 text-[#0d1117]/90">
                    Intel Celeron 8th Gen
                  </td>
                  <td className="px-6 py-4 text-[#0d1117]/90">
                    Intel Core i5 10th Gen
                  </td>
                </tr>
                {/** GPU */}
                <tr className="border-b border-[#0d1117]/10">
                  <td className="px-6 py-4 flex items-center gap-2 font-medium text-[#0d1117]">
                    <Gpu className="inline-block h-8 w-8 mr-2 text-[#0d1117]" />
                    GPU
                  </td>
                  <td className="px-6 py-4 text-[#0d1117]/90">
                    Intel UHD Graphics
                  </td>
                  <td className="px-6 py-4 text-[#0d1117]/90">
                    NVIDIA GTX 1650 8GB
                  </td>
                </tr>
                {/** Memory */}
                <tr className="border-b border-[#0d1117]/10">
                  <td className="px-6 py-4 flex items-center gap-2 font-medium text-[#0d1117]">
                    <MemoryStick className="inline-block h-8 w-8 mr-2 text-[#0d1117]" />
                    System Memory
                  </td>
                  <td className="px-6 py-4 text-[#0d1117]/90">4GB RAM</td>
                  <td className="px-6 py-4 text-[#0d1117]/90">8GB RAM</td>
                </tr>
                {/* Storage */}
                <tr className="border-b border-[#0d1117]/10">
                  <td className="px-6 py-4 flex items-center gap-2 font-medium text-[#0d1117]">
                    <HardDrive className="inline-block h-8 w-8 mr-2 text-[#0d1117]" />
                    Storage Space
                  </td>
                  <td className="px-6 py-4 text-[#0d1117]/90">
                    5 GB available
                  </td>
                  <td className="px-6 py-4 text-[#0d1117]/90">
                    10 GB available
                  </td>
                </tr>
                {/** Internet Connection */}
                <tr className="border-b border-[#0d1117]/10">
                  <td className="px-6 py-4 flex items-center gap-2 font-medium text-[#0d1117]">
                    <Globe className="inline-block h-8 w-8 mr-2 text-[#0d1117]" />
                    Internet Connection
                  </td>
                  <td className="px-6 py-4 text-[#0d1117]/90">Offline</td>
                  <td className="px-6 py-4 text-[#0d1117]/90">100Mbps</td>
                </tr>
              </tbody>
            </table>
          </div>

          <a
            href={DOWNLOAD_URL}
            className="inline-block bg-[#0d1117] text-[#ffc131] px-12 py-4 rounded-xl text-lg font-bold hover:shadow-2xl hover:shadow-black/30 transition-all transform hover:scale-105"
          >
            Download v{APP_VERSION} ({DEVELOPMENT_STAGE})
          </a>
          <p className="text-sm text-[#0d1117]/70 mt-2">Free & Open Source</p>
        </div>

        <div className="flex flex-row gap-4 justify-center">
          <a
            href={GITHUB_REPOSITORY}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border-2 border-[#0d1117]/30 text-[#0d1117] px-6 py-3 rounded-lg hover:bg-[#0d1117]/10 transition-all font-medium"
          >
            User Manual
          </a>
          <a
            href={GITHUB_REPOSITORY}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border-2 border-[#0d1117]/30 text-[#0d1117] px-6 py-3 rounded-lg hover:bg-[#0d1117]/10 transition-all font-medium"
          >
            GitHub Repository
          </a>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
