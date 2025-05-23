import React from "react";
import Image from "next/image";
import Link from "next/link";

const PreviewAboutUs = () => {
  return (
    <section className="w-[85%]  mx-auto my-20">
      <h3 className="bg-[var(--color-title-text)]/30 my-5 rounded-[10px] text-black inline-block px-5 py-3">
        About Us
      </h3>
      <div className="flex justify-between items-center">
        <div className="text-[var(--color-title-text)]  w-[65%] space-y-5 ">
          <div className="flex gap-2">
            <div className="bg-[color:var(--color-primary-olive)] w-[8px] h-[55px] my-2"></div>
            <p className="text-[16px] text-justify">
              Established in 2009 by its founder and Chairman/Chief Executive
              Officer, Furera Isma Jumare, MicroDevelopment Consulting Limited
              (MDCL) began as a multidisciplinary firm offering research,
              project management, and capacity development solutions to address
              complex development challenges in Nigeria, across different
              sectors. <br/><br/> In 2025, MDCL refined its strategic focus—transforming
              into a specialised consulting firm committed to advancing women’s
              empowerment in agriculture. By narrowing its scope to agricultural
              systems and value chains, MDCL bridges the gap in the delivery of
              tailored, impact-driven solutions that yield measurable outcomes.{" "}
            </p>
          </div>
          <Link
            href="/about"
            className="bg-[color:var(--color-primary-light-brown)] text-white px-8 py-4 rounded-xl text-lg font-semibold shadow hover:bg-[color:var(--color-primary-brown)]/90 transition"
          >
            Learn More
          </Link>
        </div>
      <div className="w-[30%]">
          <Image
          src={"/mdcl/g1.jpg"}
          alt="About Us"
          width={1000}
          height={1000}
          className="rounded-[20px] shadow-lg"
        />
      </div>
      </div>
    </section>
  );
};

export default PreviewAboutUs;
