"use client";
import Banner from "../../../components/Banner";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Deco from "@/components/Deco";
import { Twitter, Instagram, Linkedin } from "lucide-react";

const team = [
  {
    name: "Furera Isma Jumare",
    title: "Chairman/Chief Executive Officer",
    image: "/mdcl/team/furera.jpg",
    profile: "#",
    intro:
      "Furera Isma Jumare holds a Bachelor of Science (B.Sc.) degree in Botany and three Master's degrees; in Crop Physiology, in Rural Development and in International Development Management. She also holds a Postgraduate Diploma in Financial Management, Certificate in Entrepreneurial Management – EDC, Pan-Atlantic University, Lagos, Certificate in Training Practice – UK Chartered Institute of Personnel and Development (CIPD) and is an Accredited Management trainer – Centre for Management Development.",
    bio: `Furera worked with the Central Bank of Nigeria for 21 years – from 1988 to 2009, serving in the Development Finance and Other Financial Institutions Departments. She subsequently retired, and founded MicroDevelopment Consulting Limited, where she led the firm's research, project management and capacity development activities, working with clients that included the British Council, NNPC, CBN, NPA, DFID, as well as state governments such as Bauchi and Kaduna states.\n\n In 2020 Mrs. Jumare was appointed as the first Director General of the Jigawa State Investment Promotion Agency (InvestJigawa) since the agency's establishment by law in 2016. Upon her resumption, she embarked on developing a 5-year strategic plan, solidifying the agency's structure, building the investor pipeline, and signing on more investors. Some of her achievements include the following before resigning from her role in 2025, include the following:\n\nObtained a grant from Nigeria Export Promotion Council (NEPC) and developing hibiscus value chain infrastructure; led the development, adoption and gazetting of two policies for Jigawa State; Public Private Partnership (PPP) policy and the Off-Grid Solar (OGS) policy; facilitated the codification of eight incentives for investors coming into the state; brought back air flight services to the state. She also, as Reform Champion, led Jigawa State to rank 2nd in the 2023 Presidential Enabling Business Environment Council (PEBEC)'s Ease of Doing Business (EoDB) Subnational Baseline Survey, from the 3rd position in the 2021 survey, for which she received an award by then Vice President Yemi Osinbajo of Nigeria.\n\nAt different times she was: Member Editorial Board, Leadership Newspaper; Member, Kaduna State Council on Agriculture; Member, NAPEP Multi-partner Microfinance Scheme Implementation Committee (Kaduna state); Member, Kaduna State Microfinance Implementation Committee; Independent consultant with ENABLE2, a DFID (now FCDO) programme; Erstwhile President, Fenduz Unite Association; (Current) Member, Board of Trustees, Women in Management, Business and Public Service (WIMBIZ); Independent Director on the Board of Union Bank of Nigeria Plc; Director General, Jigawa State Investment Promotion Agency. She is also a fellow, Chartered Institute of Directors; member, Nigerian Institute of Management (Chartered); and fellow, Institute of Management Consultants.\n\nIn 2022 she was also featured as one of 50 inspiring Nigerian women by Business Day Newspaper.`,
    socials: [
      { type: "x", url: "#" },
      { type: "instagram", url: "#" },
      { type: "linkedin", url: "#" },
    ],
  },
  {
    name: "Ahmad Jumare",
    title: "Director",
    image: "/mdcl/team/ahmad.jpg",
    profile: "#",
    intro:
      "Ahmad Jumare is a seasoned professional with expertise in security, strategic communications, and countering violent extremism, with a track record of leading impactful initiatives across Africa.",
    bio: `Mr. Jumare is a distinguished professional with extensive experience in security, strategic communications, and Countering Violent Extremism (CVE). His career has been marked by a commitment to addressing complex societal challenges through innovative approaches and collaborative partnerships. With a strong foundation in project management, he has successfully led initiatives that counter the narratives of violent extremist organizations, particularly Boko Haram and ISWAP, across Nigeria and other regions in Africa.\n\nAs the Director of Programmes at Neem Foundation, Mr. Jumare focuses on the intersection of climate change, agricultural conflicts, and peacebuilding. He has led the implementation of programmes in Nigeria, Niger, Chad, and Cameroon, as well as efforts in Benin Republic, fostering dialogue between conflicting groups, particularly in the context of farmer-herder relations. His leadership in supporting the deployment of initiatives like the "Annual Conference on Farmer and Herder Relations" has facilitated productive engagements that address the root causes of conflict.\n\nBefore going into the development sector, Mr. Jumare worked within the security sector. At the Office of the National Security Adviser (ONSA), Mr. Jumare contributed to the implementation of Nigeria's first comprehensive National Countering Violent Extremism (CVE) programme. Alongside this, his efforts were crucial in coordinating security responses and analysis during the 2015 general elections, ensuring effective communication and collaboration among various security and intelligence units. Additionally, he contributed to the establishment of strategic frameworks that enhanced national security initiatives.\n\nMr. Jumare has a Bachelor of Arts degree in International Business and has attended numerous courses, including the Basic Management Development course at the Centre for Management Development (CMD) in Nigeria.`,
     socials: [
      { type: "x", url: "#" },
      { type: "instagram", url: "#" },
      { type: "linkedin", url: "#" },
    ],
  },
  {
    name: "Hafsah Jumare",
    title: "Director",
    image: "/mdcl/team/hafsah.jpg",
    profile: "#",
    intro:
      "Hafsah Jumare is a behavioural economist and social entrepreneur focused on transforming traditional agricultural markets across Africa through digital infrastructure and inclusive solutions.",
    bio: `Hafsah Jumare is the Founder and CEO of CoAmana, a company building digital infrastructure to support informal trade—connecting farmers and agri-traders to pricing data, credit, insurance, and procurement tools. CoAmana works in close partnership with development agencies, financial institutions, and research organizations to deepen its impact and scale inclusive solutions across rural economies.\n\nShe holds a Master’s degree in Applied Economics (with Distinction) from the University of Cape Town, where her research on farmer adoption of technology and financial services led to multiple publications and earned her the Commerce Faculty’s Award of Excellence in Environmental Policy.\n\nHafsah leads operations in Nigeria and Kenya, working across rural and semi-urban hubs. Through CoAmana’s flagship platforms, Amana Market and Amana Insights, she equips market actors with offline-first tools like USSD and call centers, helping them digitize trade, access finance, and build resilience in low-connectivity environments. She is passionate about building systems that elevate farmers, women, youth, and informal traders as key drivers of Africa’s economic future.\n\n• Jumare, H, Visser, M. and Brick, K. (2016). Risk Preferences and the Poverty Trap: A Look at Technology Uptake amongst Smallholder Farmers in the Matzikama Municipality. Working Paper. Environmental Policy Research Unit, University of Cape Town.\n• Jumare, H, Visser, M. and Brick, K. (2016). Determinants of Technology Adoption in Organic Farming: A Look at Urban Smallholder Farmers in Cape Town. Working Paper.\n• Jumare, H, Visser, M. and Brick, K. (2016). The Link between Insurance and Farm Technology Uptake amongst Small Holder Farmers in the Matzikama Municipality.`,
      socials: [
      { type: "x", url: "#" },
      { type: "instagram", url: "#" },
      { type: "linkedin", url: "#" },
    ],
  },
  {
    name: "Prof. Muhammad Kabir Isa",
    title: "Director",
    image: "/mdcl/team/prof.jpg",
    profile: "#",
    intro:
      "Professor Muhammad Kabir Isa is a governance and development expert with over two decades of experience in academic research, teaching, and consulting in political science, local governance, and violent extremism.",
    bio: `Professor Muhammad Kabir Isa is a Professor of Governance & Administration and graduate of Political Science (BSc) from Ahmadu Bello University. He also has M.Sc. and PhD in Political Science from the same university. Professor Isa teaches at the Department of Local Government and Development Studies in the university since September 1992 and was a visiting lecturer at Gombe State University from 2006 to 2017.\n\nHe has extensive research and publication experience in Social Change, Social Movements, Administrative Sciences, Ethnic Conflict Management, Youth Studies, Political Islam, Terrorism, CVE, and Local Government Administration. His publications include:\n• Nigerian Local Government System and Governance: Lessons, Prospects and Challenges for Post 2015 Development Goals\n• The Youth and Militant Ethnic Movements in Nigeria: The Search for Survival and Identity\n• The State, Social Movements and Globalisation: The Recurrent of Militant Islamic Groups in Northern Nigeria (2008)\n\nProfessor Isa has participated in global conferences such as the IRSPM Research Conference (UK, 2015) and HEDAYAH-RESOLVE CVE Conference (NYU Abu Dhabi, 2015). He is a pioneer member of the RESOLVE Network in Nigeria, UNESCO-MOST Ethno-net, and IRSPM.`,
     socials: [
      { type: "x", url: "#" },
      { type: "instagram", url: "#" },
      { type: "linkedin", url: "#" },
    ],
  },
  {
    name: "Mrs Vivienne Ochee Bamgboye",
    title: "Director",
    image: "/mdcl/team/mrsv.jpg",
    profile: "#",
    intro:
      "Vivienne Bamgboye is a seasoned organizational development and change management consultant with over 20 years of international and national experience in youth development, policy, and performance management.",
    bio: `Vivienne, a consultant with MDCL, has a B.A in English/Dramatic Arts from Ahmadu Bello University, LL.B from University of Ibadan, B.L from the Nigerian Law School, and PG.D in Youth/Social Work. She has provided capacity development and OD services for clients such as Dansa Holdings Ltd, Diamond Bank, nahco aviance, NIMASA, Ford Foundation, and PEFMB.\n\nShe led the PIND/IYF Niger Delta Youth Assessment and served on the SPRM project for the Governors’ Forum. Between 1994 and 2003, she worked in the UK with Camden, Westminster, and Harrow Local Authorities, then returned to Nigeria as COO of LEAP Africa and later as Senior Consultant with VLA.\n\nHer most recent roles include Lead OD Consultant for Dansa Holdings/Dangote Group, Change Management Consultant for Edo SEEFOR Project, and OD Consultant for the Propcom/MDCL TOOAN Capacity Development Support Consultancy. Vivienne holds certifications in PRINCE 2, PROSCI, CMD, DISC Analysis, and Coaching.\n\nShe currently serves on the boards of Meyer Plc and Greenwich Merchant Bank.`,
     socials: [
      { type: "x", url: "#" },
      { type: "instagram", url: "#" },
      { type: "linkedin", url: "#" },
    ],
  },
];

function TeamProfileModal({ member, onClose }) {
  if (!member) return null;
  return (
    <div className="fixed text-justify inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white max-w-5xl w-full rounded-xl shadow-2xl p-6 md:p-10 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Header Section */}
        <div className="flex space-x-10">
          {/* Image */}
    
            <div className="relative   w-[45%] h-full">
              <Image
                src={member.image}
                alt={member.name}
                width={1000}
                height={1000}
                className="rounded-xl"
              />
            </div>
      
          {/* Text Info */}
          <div className="w-[100%]">
            <h2 className="font-bold text-2xl uppercase text-gray-800 mb-2">
              {member.name}
            </h2>
            <div className="font-semibold text-lg text-gray-700 mb-4">
              {member.title}
            </div>
            <div className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-line">
              {member.intro}
            </div>
          </div>
        </div>
        {/* Bio */}
        <div className="mt-10 text-[15px] text-gray-800 leading-[1.8] whitespace-pre-line">
          {member.bio}
        </div>
        {/* Social Links */}
        {member.socials?.length > 0 && (
          <div className="mt-6">
            <div className="font-semibold text-gray-700 mb-2">Social Media Handles</div>
            <div className="flex gap-4">
              {member.socials.map((s, i) => {
                let Icon = null;
                if (s.type === "x") Icon = Twitter;
                if (s.type === "instagram") Icon = Instagram;
                if (s.type === "linkedin") Icon = Linkedin;
                return (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition text-[var(--color-primary-olive)] text-2xl"
                  >
                    {Icon && <Icon />}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OurTeam() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <main className="bg-white min-h-screen">
      <Banner
        title="About Us"
        subtitle={
          <span className="text-center font-medium text-white/70">
            <Link href="/" className="hover:underline ">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/about" className="hover:underline ">
              About Us
            </Link>{" "}
            /{" "}
            <Link
              href="/about/team"
              className="hover:underline text-white font-bold"
            >
              Our Team
            </Link>
          </span>
        }
        image="/mdcl/g4.jpg"
      />
      <Deco />
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold uppercase text-[var(--color-title-text)] mb-1">
            OUR TEAM
          </h2>
          <div className="w-24 h-1 bg-[var(--color-primary-olive)] rounded-full mb-6" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 justify-center items-start">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="w-full pb-5 items-center bg-white rounded-xl shadow "
            >
              <div className="w-full rounded-xl overflow-hidden mb-4 bg-gray-100">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={144}
                  height={170}
                  className="w-full h-[40vh]"
                />
              </div>
              <div className="font-bold text-[13px] uppercase text-center mb-1 text-[var(--color-title-text)]">
                {member.name}
              </div>
              <div className="text-xs text-gray-700 text-center mb-1">
                {member.title}
              </div>
              <button
                className="mx-auto block text-[var(--color-primary-magenta)] text-xs font-semibold hover:underline"
                onClick={() => setOpenIdx(idx)}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
        <TeamProfileModal
          member={openIdx !== null ? team[openIdx] : null}
          onClose={() => setOpenIdx(null)}
        />
      </section>
    </main>
  );
}
