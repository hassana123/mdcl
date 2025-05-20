import React from "react";
import Image from "next/image";
const PreviewAboutUs = () => {
  return (
    <section className="w-[85%]  mx-auto my-10">
      <h3 className="bg-[var(--color-title-text)]/30 my-5 rounded-[10px] text-black inline-block px-5 py-3">
        About Us
      </h3>
      <div className="flex justify-between items-center">
        <div className="text-[var(--color-title-text)] w-[50%] space-y-5 ">
        <h2 className="font-bold text-[29px]">MICRODEVELOPMENT CONSULTING LIMITED</h2>
        <div className="flex gap-2">
          <div className="bg-[color:var(--color-primary-olive)] w-[8px] h-[55px] my-2"></div>
          <p className="text-[18px] text-justify">
            MicroDevelopment Consulting Limited (MDCL) is a Centre for
            Management Development (CMD) accredited multidisciplinary consulting
            firm that focuses on research, project management and capacity
            development. Registered in 2009 by its founder and CEO, it has a
            team of permanent employees and associate consultants that are
            proficient in their fields, including; economics, conflict and
            crisis management, agriculture, rural development, development
            management, finance and accounting, training practice, management
            development, organisational development, communication and change
            management..
          </p>
        </div>
      <button className="bg-[color:var(--color-primary-brown)] text-white px-8 py-3 rounded-xl text-lg font-semibold shadow hover:bg-[color:var(--color-primary-brown)]/90 transition">
          Learn More
        </button>
      </div>
      <Image src={"/mdcl/g1.jpg"} alt="About Us" width={400} height={300} className="rounded-[20px] shadow-lg" />
      </div>
    </section>
  );
};

export default PreviewAboutUs;
