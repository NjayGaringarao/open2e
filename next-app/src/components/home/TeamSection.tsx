import React from "react";
import Image from "next/image";
const TeamSection = () => {
  return (
    <section className="py-20 px-4 bg-[#0d1117]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#eaeef4] mb-4">Our Team</h2>
          <p className="text-xl text-[#c5cad3]">
            Dedicated researchers and developers of PRMSU - Castillejos Campus
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Image
              src={"/image/aly.png"}
              alt={"Alyssa Jane P. Marquez"}
              width={96}
              height={96}
              className="w-24 h-24 bg-gradient-to-br from-[#ffc131] to-[#e6a91d] rounded-full mx-auto mb-4 flex items-center justify-center text-[#0d1117] text-3xl font-bold"
            />

            <h3 className="text-xl font-bold text-[#eaeef4]">
              Alyssa Jane P. Marquez
            </h3>
            <p className="text-[#ffc131] font-medium">Principal Investigator</p>
          </div>

          <div className="text-center">
            <Image
              src={"/image/jr.png"}
              alt={"Niño Jr V. Garingarao"}
              width={96}
              height={96}
              className="w-24 h-24 bg-gradient-to-br from-[#ffc131] to-[#e6a91d] rounded-full mx-auto mb-4 flex items-center justify-center text-[#0d1117] text-3xl font-bold"
            />
            <h3 className="text-xl font-bold text-[#eaeef4]">
              Niño Jr V. Garingarao
            </h3>
            <p className="text-[#ffc131] font-medium">Software Engineer</p>
          </div>

          <div className="text-center">
            <Image
              src={"/image/paul.png"}
              alt={"John Paul C. Marquez"}
              width={96}
              height={96}
              className="w-24 h-24 bg-gradient-to-br from-[#ffc131] to-[#e6a91d] rounded-full mx-auto mb-4 flex items-center justify-center text-[#0d1117] text-3xl font-bold"
            />
            <h3 className="text-xl font-bold text-[#eaeef4]">
              John Paul C. Marquez
            </h3>
            <p className="text-[#ffc131] font-medium">R&D Support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
