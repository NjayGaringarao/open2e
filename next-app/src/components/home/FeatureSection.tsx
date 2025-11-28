import React from "react";

const FeatureSection = () => {
  return (
    <section id="features" className="py-20 px-4 bg-[#0d1117]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#eaeef4] mb-4">
            Powerful Features for Modern Education
          </h2>
          <p className="text-xl text-[#c5cad3]">
            Everything you need to evaluate computer literacy assessments
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-[#151b23] rounded-xl p-8 shadow-lg border border-[#2a313c] hover:shadow-2xl hover:shadow-[#ffc131]/10 hover:border-[#ffc131]/30 transition-all">
            <div className="w-14 h-14 bg-[#60a5fa]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-[#eaeef4] mb-3">
              AI-Powered Grading
            </h3>
            <p className="text-[#c5cad3] mb-4">
              Automated scoring (0-10 scale) with detailed justifications for
              every point awarded or deducted.
            </p>
            <ul className="space-y-2 text-sm text-[#c5cad3]">
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Instant evaluation results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Comprehensive feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Customizable rubrics</span>
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#151b23] rounded-xl p-8 shadow-lg border border-[#2a313c] hover:shadow-2xl hover:shadow-[#ffc131]/10 hover:border-[#ffc131]/30 transition-all">
            <div className="w-14 h-14 bg-[#ffc131]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">🔌</span>
            </div>
            <h3 className="text-2xl font-bold text-[#eaeef4] mb-3">
              Works Online & Offline
            </h3>
            <p className="text-[#c5cad3] mb-4">
              Dual AI modes: GPT-4o for cloud-based evaluation or Phi4-mini for
              offline use.
            </p>
            <ul className="space-y-2 text-sm text-[#c5cad3]">
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>No internet? No problem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Automatic mode switching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Privacy-focused offline mode</span>
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#151b23] rounded-xl p-8 shadow-lg border border-[#2a313c] hover:shadow-2xl hover:shadow-[#ffc131]/10 hover:border-[#ffc131]/30 transition-all">
            <div className="w-14 h-14 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-2xl font-bold text-[#eaeef4] mb-3">
              AI Detection
            </h3>
            <p className="text-[#c5cad3] mb-4">
              Identify potentially AI-generated content in student responses to
              maintain academic integrity.
            </p>
            <ul className="space-y-2 text-sm text-[#c5cad3]">
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Powered by Sapling AI</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Percentage-based confidence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Instant detection results</span>
              </li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div className="bg-[#151b23] rounded-xl p-8 shadow-lg border border-[#2a313c] hover:shadow-2xl hover:shadow-[#ffc131]/10 hover:border-[#ffc131]/30 transition-all">
            <div className="w-14 h-14 bg-[#34d17c]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-2xl font-bold text-[#eaeef4] mb-3">
              Interactive AI Chat
            </h3>
            <p className="text-[#c5cad3] mb-4">
              Educational AI assistant for discussing computer literacy topics
              with students.
            </p>
            <ul className="space-y-2 text-sm text-[#c5cad3]">
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Context-aware responses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Voice interaction support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Educational focus</span>
              </li>
            </ul>
          </div>

          {/* Feature 5 */}
          <div className="bg-[#151b23] rounded-xl p-8 shadow-lg border border-[#2a313c] hover:shadow-2xl hover:shadow-[#ffc131]/10 hover:border-[#ffc131]/30 transition-all">
            <div className="w-14 h-14 bg-[#ffc131]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-[#eaeef4] mb-3">
              Analytics Dashboard
            </h3>
            <p className="text-[#c5cad3] mb-4">
              Track student performance over time with comprehensive analytics
              and insights.
            </p>
            <ul className="space-y-2 text-sm text-[#c5cad3]">
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Performance trends</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Historical data tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Export capabilities</span>
              </li>
            </ul>
          </div>

          {/* Feature 6 */}
          <div className="bg-[#151b23] rounded-xl p-8 shadow-lg border border-[#2a313c] hover:shadow-2xl hover:shadow-[#ffc131]/10 hover:border-[#ffc131]/30 transition-all">
            <div className="w-14 h-14 bg-[#ef4444]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">🎤</span>
            </div>
            <h3 className="text-2xl font-bold text-[#eaeef4] mb-3">
              Voice Interaction
            </h3>
            <p className="text-[#c5cad3] mb-4">
              Speech recognition and text-to-speech for accessible, hands-free
              operation.
            </p>
            <ul className="space-y-2 text-sm text-[#c5cad3]">
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Voice input for answers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Audio feedback reading</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#34d17c] mt-1">✓</span>
                <span>Accessibility-focused</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
