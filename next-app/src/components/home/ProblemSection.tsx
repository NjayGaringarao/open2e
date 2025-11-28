import React from "react";

const ProblemSection = () => {
  return (
    <section className="py-20 px-4 bg-[#151b23]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#eaeef4] mb-4">
            The Challenge in Computer Literacy Education
          </h2>
          <p className="text-xl text-[#c5cad3] max-w-3xl mx-auto">
            Educators spend countless hours manually grading open-ended
            responses, leading to delays in feedback and inconsistent evaluation
            standards.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl p-6">
            <div className="text-3xl mb-3">⏰</div>
            <h3 className="text-xl font-bold text-[#eaeef4] mb-2">
              Time-Consuming
            </h3>
            <p className="text-[#c5cad3]">
              Hours spent grading dozens of student responses manually
            </p>
          </div>
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-[#eaeef4] mb-2">
              Inconsistent
            </h3>
            <p className="text-[#c5cad3]">
              Subjective grading varies between evaluators and sessions
            </p>
          </div>
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl p-6">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-xl font-bold text-[#eaeef4] mb-2">
              Limited Feedback
            </h3>
            <p className="text-[#c5cad3]">
              Lack of detailed, constructive feedback for student improvement
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-[#ffc131] to-[#e6a91d] text-[#0d1117] px-8 py-4 rounded-full text-2xl font-bold">
            Open2E Solves This
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
