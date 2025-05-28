import React from "react";
import Image from "next/image";
import Link from "next/link";

const PreviewAboutUs = () => {
  return (
    <section className="md:w-[85%] w-[95%]   mx-auto my-20">
      <h3 className="bg-[var(--color-title-text)]/30 my-5 rounded-[10px] text-black inline-block px-5 py-3">
        About Us
      </h3>
      <div className="md:flex justify-between md:space-y-0 space-y-10 items-center">
        <div className="text-[var(--color-title-text)]  md:w-[45%] space-y-5 ">
          <div className="flex gap-2">
            <div className="bg-[color:var(--color-primary-olive)] w-[8px] h-[55px] my-2"></div>
            <p className="text-[16px] text-justify mb-5">
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
      <div className="md:w-[40%]">
          <Image
          src={"/mdcl/gallery/g (10).jpg"}
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
