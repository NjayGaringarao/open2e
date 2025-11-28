import React from "react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-[#151b23]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#eaeef4] mb-4">
            How Open2E Works
          </h2>
          <p className="text-xl text-[#c5cad3]">
            Four simple steps to automated evaluation
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#ffc131] to-[#e6a91d] text-[#0d1117] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-bold text-[#eaeef4] mb-2">
              Set Question and Rubric
            </h3>
            <p className="text-[#c5cad3]">
              Select Rubric for scoring criteria and input your question related
              to computer literacy
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#ffc131] to-[#e6a91d] text-[#0d1117] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-bold text-[#eaeef4] mb-2">
              Add Student Answer
            </h3>
            <p className="text-[#c5cad3]">
              Paste, type, or even recite the student&apos;s open-ended response
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#ffc131] to-[#e6a91d] text-[#0d1117] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold text-[#eaeef4] mb-2">
              AI Evaluation
            </h3>
            <p className="text-[#c5cad3]">
              Get instant AI-powered grading with score, justification, AI
              detection, and helpful articles related to the topic
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#ffc131] to-[#e6a91d] text-[#0d1117] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="text-xl font-bold text-[#eaeef4] mb-2">
              Review & Save
            </h3>
            <p className="text-[#c5cad3]">
              Review and save the evaluation results for future reference for
              further analysis and historical data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
