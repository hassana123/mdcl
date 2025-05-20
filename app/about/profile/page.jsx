import Banner from "../../../components/Banner";
import Image from "next/image";
import Deco from "@/components/Deco";
import Link from "next/link";
export default function CompanyProfile() {
  return (
    <main className="bg-white">
  

<Banner
  title="About Us"
  subtitle={
    <span className="text-center font-medium text-white/70">
      <Link href="/" className="hover:underline">Home</Link> /{" "}
      <Link href="/about" className="hover:underline ">About Us</Link> /{" "}
      <Link href="/about/company-profile" className="hover:underline text-white font-bold">
        Company Profile
      </Link>
    </span>
  }
  image="/mdcl/g4.jpg"
/>

      <Deco />
      {/* Intro Section - Figma layout */}
      <section className="max-w-6xl mx-auto  my-20">
        <div className="flex items-center justify-between">
          {/* Left: Heading and text */}
          <div className="w-[50%]">
            <h2 className="text-2xl font-bold mb-4 uppercase text-[var(--color-title-text)]">
              MICRODEVELOPMENT CONSULTING LIMITED
            </h2>
            <div className="flex gap-2">
              <span className="block w-[25px] h-[55px] bg-[var(--color-primary-olive)]"></span>
              <p className="text-justify text-[18px] text-gray-700 mb-6">
                MicroDevelopment Consulting Limited (MDCL) is a Centre for
                Management Development (CMD) accredited multidisciplinary
                consulting firm that focuses on research, project management and
                capacity development. Registered in 2009 by its founder and CEO,
                it has a team of permanent employees and associate consultants
                that are proficient in their fields, including: economics,
                conflict and crisis management, agriculture, rural development,
                development management, finance and accounting, training
                practice, management development, organizational development,
                communication and change management.
              </p>
            </div>
          </div>
          {/* Right: Two stacked images */}
          <div className="">
            <Image
              src="/mdcl/g2.png"
              alt="About MDCL"
              width={420}
              height={100}
              className="rounded-xl object-cover mb-2"
            />
          </div>
        </div>
        {/* Below: Image left, text right */}
        <div className="flex justify-between items-center my-10">
          <div className="">
            <Image
              src="/mdcl/g7.jpg"
              alt="MDCL Engagement"
              width={420}
              height={100}
              className="rounded-xl object-cover mb-2"
            />
          </div>
          <div className=" w-[50%] flex gap-2">
            <span className="block w-[25px] h-[55px] bg-[var(--color-primary-olive)]"></span>

            <p className="text-justify text-[18px] text-gray-700 mb-4">
              Established in 2009 by its founder and Chairman/Chief Executive
              Officer, Furera Isma Jumare, MicroDevelopment Consulting Limited
              (MDCL) began as a multidisciplinary firm offering research,
              project management and capacity development solutions to address
              complex development challenges in Nigeria, across different
              sectors. In 2025, MDCL refined its strategic focus—transforming
              into a specialised consulting firm committed to advancing women's
              empowerment in agriculture. By narrowing its scope to agricultural
              systems and value chains, MDCL bridges the gap in the delivery of
              tailored, impact-driven solutions that yield measurable outcomes.
            </p>
          </div>
        </div>
        {/* Approach paragraph full width */}
        <div className="mt-6">
          <p className="text-justify text-[18px] text-gray-700">
            Our approach is grounded in strengthening institutions, fostering
            innovation, and building inclusive systems that amplify women's
            voices and leadership in agriculture. We are dedicated to equipping
            women in agriculture with the tools, knowledge, and opportunities
            needed to thrive—economically, socially, and professionally. While
            Northern Nigeria remains our foundational base, MDCL's ambition is
            continental. We are steadfast in our commitment to supporting women
            across Africa, unlocking their potential as changemakers in
            agriculture and sustainable development.
          </p>
        </div>
      </section>

      {/* WHAT WE ARE */}
      <section className="bg-[fbfbfd] py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-xl font-bold mb-6 uppercase text-[var(--color-title-text)]">
            WHAT WE ARE
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[url('/mdcl/bg4.png')] h-[195px] font-bold text-[var(--color-primary-olive)] bg-cover bg-center rounded-[20px] p-6 shadow flex flex-col items-start">
              <span className=" text-[14px]  mb-5">
                INNOVATION & CAPACITY BUILDERS
              </span>
              <p className="text-[13.5px]">
                We deliver training and tools that help women in agriculture
                thrive.
              </p>
            </div>
            <div className="bg-[url('/mdcl/bg3.png')] font-bold text-[var(--color-primary-brown)] bg-cover bg-center rounded-[20px] p-6 shadow flex flex-col items-start">
              <span className="font-bold text-[14px]  mb-5">
                WOMEN-FOCUSED AGRI-CATALYSTS
              </span>
              <p className="text-[13.5px]">
                We design programs that turn women farmers into market leaders.
              </p>
            </div>
            <div className="bg-[url('/mdcl/bg2.png')] font-bold text-[var(--color-primary-magenta)] bg-cover bg-center rounded-[20px] p-6 shadow flex flex-col items-start">
              <span className="text-[14px] mb-5">
                NORTHERN ROOTS, PAN-AFRICAN VISION
              </span>
              <p className="text-[13.5px]">
                From Northern Nigeria, we scale women-led solutions across
                Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR ASPIRATION & WHAT WE COMMIT TO */}
      <section className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="relative z-0">
            <div className="absolute -top-8 -left-9 z-[-1]">
              <svg
                width="63"
                height="63"
                viewBox="0 0 73 73"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="36.5" cy="36.5" r="36.5" fill="#FEE7FE" />
              </svg>
            </div>

            <h4 className="text-lg z-1000 font-bold text-[var(--color-primary-magenta)] mb-5 uppercase">
              OUR ASPIRATION
            </h4>
          </div>
          <p className="text-gray-700 mb-4">
            To be a trusted partner in empowering women across Africa to
            participate meaningfully and thrive in agricultural systems and
            value chains.
          </p>

          <div className="relative z-0 my-5">
            <div className="absolute -top-5 -left-7 z-[-1]">
              <svg
                width="63"
                height="63"
                viewBox="0 0 73 73"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="36.5"
                  cy="36.5"
                  r="36.5"
                  fill="#FCFCD9"
                  fillOpacity="0.5"
                />
              </svg>
            </div>

            <h4 className="text-lg -1000 font-bold text-[var(--color-primary-olive)] mb-5 uppercase">
              WHAT WE COMMIT TO
            </h4>
          </div>
          <p className="text-gray-700">
            Through research, project management, and capacity development, we
            are dedicated to equipping women with the knowledge, skills, and
            opportunities that enhance their participation, amplify their
            voices, and empower them to thrive in agriculture.
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src="/mdcl/w1.png"
            alt="Women in Agriculture"
            width={320}
            height={220}
            className="rounded-xl object-cover"
          />
        </div>
      </section>

      {/* WHAT WE STAND FOR */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-xl font-bold mb-10 uppercase text-[var(--color-title-text)] text-center relative">
            <span className="inline-block border-t-2 border-[var(--color-olives)] w-10 align-middle mr-2"></span>
            WHAT WE STAND FOR
            <span className="inline-block border-t-2 border-[var(--color-olive)] w-10 align-middle ml-2"></span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-[var(--color-primary-brown)]">
            {/* Item 1 */}
            <div className="flex flex-col items-center ">
              <div className="w-12 h-12  bg-[var(--color-primary-brown)]/30 rounded-full p-2 mb-4">
                <Image
                  src="/mdcl/v4.svg"
                  width={20}
                  height={20}
                  alt="Teamwork Icon"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="font-bold  mb-1">Teamwork</h1>
              <p className="text-xs  max-w-[220px] ">
                We foster collaboration and inclusivity, leveraging diverse
                perspectives for shared success.
              </p>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 bg-[var(--color-primary-brown)]/30 rounded-full p-2">
                <img
                  src="/mdcl/v1.svg"
                  alt="Integrity Icon"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="font-bold mb-1">Integrity</h1>
              <p className="text-xs  max-w-[220px]">
                We foster collaboration and inclusivity, leveraging diverse
                perspectives for shared success.
              </p>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 bg-[var(--color-primary-brown)]/30 rounded-full p-2">
                <img
                  src="/mdcl/v2.svg"
                  alt="Professionalism Icon"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="font-bold  mb-1">Professionalism</h1>
              <p className="text-xs max-w-[220px]">
                We act with competence, reliability, and respect, ensuring
                quality and continuous improvement.
              </p>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 bg-[var(--color-primary-brown)]/30 rounded-full p-2">
                <img
                  src="/mdcl/v3.svg"
                  alt="Excellent Service Icon"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="font-bold  mb-1">Excellent Service</div>
              <p className="text-xs  max-w-[220px]">
                We deliver timely, effective, and client-focused solutions that
                exceed expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STRATEGIC PILLARS */}
      <section className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6 flex items-center my-10 gap-2">
            <span className=" w-[2px] h-[65px] bg-[var(--color-primary-olive)] block"></span>

            <div className="">
              <h3 className="text-xl font-bold uppercase text-[var(--color-title-text)] mb-1 inline-block">
                OUR STRATEGIC PILLARS
              </h3>
              <p className="text-[15px] text-gray-700 mt-2 ">
                Our work is supported by six strategic pillars
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6  text-center">
            {/* Row 1 */}
            <div className="bg-white rounded-xl shadow flex flex-col items-start border border-gray-100">
              <div className="w-full py-3 text-white  rounded-t-xl bg-[var(--color-primary-brown)] mb-3">
                <span className="font-bold  mb-2 px-4 pt-2">
                  Institutional Capacity Development
                </span>
              </div>
              <p className="text-gray-700 px-4 pb-4">
                Strengthening institutions to better serve and support women in
                agriculture.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow flex flex-col items-start border border-gray-100">
              <div className="w-full py-3 rounded-t-xl text-white bg-[var(--color-primary-olive)] mb-3">
                <span className="font-bold  mb-2 px-4 pt-2">
                  Women's Empowerment in Agriculture
                </span>
              </div>
              <p className="text-gray-700 px-4 pb-4">
                Strengthening institutions to better serve and support women in
                agriculture.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow flex flex-col items-start border border-gray-100">
              <div className="w-full py-3 text-white rounded-t-xl bg-[var(--color-primary-brown)] mb-3">
                <span className="font-bold  mb-2 px-4 pt-2">
                  Research and Innovation
                </span>
              </div>

              <p className="text-gray-700 px-4 pb-4">
                Transforming knowledge into inclusive policies and solutions
                which reflect women's agricultural experiences.
              </p>
            </div>
            {/* Row 2 */}
            <div className="bg-white rounded-xl shadow flex flex-col items-start border border-gray-100">
              <div className="w-full py-3 text-white rounded-t-xl bg-[var(--color-primary-brown)] mb-3">
                <span className="font-bold  mb-2 px-4 pt-2">
                  Sustainable Agribusiness Development
                </span>
              </div>

              <p className="text-gray-700 px-4 pb-4">
                Supporting women-led agribusinesses to grow
                sustainably—preserving both livelihoods and the environment.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow flex flex-col items-start border border-gray-100">
              <div className="w-full py-3 text-white rounded-t-xl bg-[var(--color-primary-olive)] mb-3">
                <span className="font-bold  mb-2 px-4 pt-2">
                  Strategic Partnerships and Advocacy
                </span>
              </div>
              <p className="text-gray-700 px-4 pb-4">
                Collaborating to advocate for inclusive policies which elevate
                women's roles in agriculture.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow flex flex-col items-start border border-gray-100">
              <div className="w-full py-3 text-white rounded-t-xl bg-[var(--color-primary-brown)] mb-3">
                <span className="font-bold  mb-2 px-4 pt-2">
                  Research and Innovation
                </span>
              </div>

              <p className="text-gray-700 px-4 pb-4">
                Transforming knowledge into inclusive policies and solutions
                which reflect women's agricultural experiences.
              </p>
            </div>
          </div>
        </div>
        <div className="w-[80%] mx-auto">
          <Image
            src={"/mdcl/pillars.png"}
            alt="MDCL pillars"
            width={1000}
            height={1000}
            className="w-full h-auto object-cover mt-10"
          />
        </div>
      </section>
    </main>
  );
}
