import DownloadSection from "@/components/home/DownloadSection";
import FeatureSection from "@/components/home/FeatureSection";
import Footer from "@/components/home/Footer";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import ProblemSection from "@/components/home/ProblemSection";
import TeamSection from "@/components/home/TeamSection";
import Image from "next/image";
const Navigation = () => {
  return (
    <nav className="fixed w-full bg-black/60 backdrop-blur-md border-b border-uGrayLight z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Image src="/icon/open2e.png" alt="Open2E" width={38} height={38} />
            <span className="text-2xl font-bold text-primary">Open2E</span>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <a
              href="#features"
              className="text-gray-300 hover:text-primary transition-colors font-medium hidden md:block"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-300 hover:text-primary transition-colors font-medium hidden md:block"
            >
              How It Works
            </a>
            <a
              href="#download"
              className="bg-primary text-uBlack px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-shadow font-medium"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navigation />

      <HeroSection />

      <ProblemSection />

      <FeatureSection />

      <HowItWorks />

      <DownloadSection />

      <TeamSection />

      <Footer />
    </div>
  );
}
