"use client";
import Banner from "@/components/Banner";
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
      "Furera Isma Jumare holds a Bachelor of Science (B.Sc.) degree in Botany and three Master’s degrees; in Crop Physiology, in Rural Development and in International Development Management. She also holds a Postgraduate Diploma in Financial Management, Certificate in Entrepreneurial Management – EDC, Pan-Atlantic University, Lagos, Certificate in Training Practice – UK Chartered Institute of Personnel and Development (CIPD) and is an Accredited Management trainer – Centre for Management Development.",
    bio: `Furera worked with the Central Bank of Nigeria for 21 years – from 1988 to 2009, serving in the Development Finance and Other Financial Institutions Departments. She subsequently retired, and founded MicroDevelopment Consulting Limited, where she led the firm’s research, project management and capacity development activities, working with clients that included the British Council, NNPC, CBN, NPA, DFID, as well as state governments such as Bauchi and Kaduna states.   
 
In 2020 Mrs. Jumare was appointed as the first Director General of the Jigawa State Investment Promotion Agency (InvestJigawa) since the agency’s establishment by law in 2016. Upon her resumption, she embarked on developing a 5-year strategic plan, solidifying the agency’s structure, building the investor pipeline, and signing on more investors. Some of her achievements include the following before resigning from her role in 2025, include the following:
 
Obtained a grant from Nigeria Export Promotion Council (NEPC) and developing hibiscus value chain infrastructure; led the development, adoption and gazetting of two policies for Jigawa State; Public Private Partnership (PPP) policy and the Off-Grid Solar (OGS) policy; facilitated the codification of eight incentives for investors coming into the state; brought back air flight services to the state. She also, as Reform Champion, led Jigawa State to rank 2nd in the 2023 Presidential Enabling Business Environment Council (PEBEC)’s Ease of Doing Business (EoDB) Subnational Baseline Survey, from the 3rd position in the 2021 survey, for which she received an award by then Vice President Yemi Osinbajo of Nigeria.  

At different times she was: Member Editorial Board, Leadership Newspaper; Member, Kaduna State Council on Agriculture; Member, NAPEP Multi-partner Microfinance Scheme Implementation Committee (Kaduna state); Member, Kaduna State Microfinance Implementation Committee; Independent consultant with ENABLE2, a DFID (now FCDO) programme; Erstwhile President, Frendz Unite Association; (Current) Member, Board of Trustees, Women in Management, Business and Public Service (WIMBIZ); Independent Director on the Board of Union Bank of Nigeria Plc.; Director General, Jigawa State Investment Promotion Agency. She is also a fellow, Chartered Institute of Directors; member, Nigerian Institute of Management (Chartered); and fellow, Institute of Management Consultants. 

In 2022 she was also featured as one of 50 inspiring Nigerian women by Business Day Newspaper.
`,
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
      "Mr. Jumare is a distinguished professional with extensive experience in security, strategic communications, and Countering Violent Extremism (CVE). His career has been marked by a commitment to addressing complex societal challenges through innovative approaches and collaborative partnerships. With a strong foundation in project management, he has successfully led initiatives that counter the narratives of violent extremist organizations, particularly Boko Haram and ISWAP, across Nigeria and other regions in Africa. His contributions to high-level security and social development discussions have positioned him as a key representative for Nigeria on the global stage. ",
    bio: `As the Director of Programmes at Neem Foundation, Mr. Jumare focuses on the intersection of climate change, agricultural conflicts, and peacebuilding. He has led the implementation of programmes in Nigeria, Niger, Chad, and Cameroon, as well as efforts in Benin Republic, fostering dialogue between conflicting groups, particularly in the context of farmer-herder relations. His leadership in supporting the deployment of initiatives like the "Annual Conference on Farmer and Herder Relations" has facilitated productive engagements that address the root causes of conflict.

Before going into the development sector, Mr Jumare worked within the security sector. At the Office of the National Security Adviser (ONSA), Mr. Jumare contributed to the implementation of Nigeria's first comprehensive National Countering Violent Extremism (CVE) programme. Alongside this, his efforts were crucial in coordinating security responses and analysis during the 2015 general elections, ensuring effective communication and collaboration among various security and intelligence units. Additionally, he contributed to the establishment of strategic frameworks that enhanced national security initiatives. His experience working with government agencies, civil society organizations, and international development partners reflects his ability to navigate complex environments and drive impactful change. His strategic leadership and commitment to fostering sustainable solutions continue to promote stability and security in conflict-prone regions across West Africa.

Mr. Jumare has a Bachelor of Arts degree in International Business and has attended numerous courses, including the Basic Management Development course at the Centre for Management Development (CMD) in Nigeria.  
`,
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
      "Hafsah Jumare is a behavioural economist and social entrepreneur focused on transforming traditional agricultural markets across Africa. She is the Founder and CEO of CoAmana, a company building digital infrastructure to support informal trade—connecting farmers and agri-traders to pricing data, credit, insurance, and procurement tools. CoAmana works in close partnership with development agencies, financial institutions, and research organizations to deepen its impact and scale inclusive solutions across rural economies.",
    bio: `She holds a Master’s degree in Applied Economics (with Distinction) from the University of Cape Town, where her research on farmer adoption of technology and financial services led to multiple publications and earned her the Commerce Faculty’s Award of Excellence in Environmental Policy.

Hafsah leads operations in Nigeria and Kenya, working across rural and semi-urban hubs. Through CoAmana’s flagship platforms; Amana Market and Amana Insights, she equips market actors with offline-first tools like USSD and call centers, helping them digitize trade, access finance, and build resilience in low-connectivity environments.
She is passionate about building systems that elevate farmers, women, youth, and informal traders as key drivers of Africa’s economic future.

•	Jumare, H, Visser, M. and Brick, K. (2016).  Risk Preferences and the Poverty Trap: A Look at Technology Uptake amongst Smallholder Farmers in the Matzikama Municipality. Working Paper. Environmental Policy Research Unit, University of Cape Town. Also published in the book, Agricultural Adaptation to Climate Change in Africa: Food Security in a Changing Environment, Economic Research Southern Africa Journal and the 2016 Symposium on Economic Experiments in Developing Countries (SEEDEC) held July 12-13 in Nairobi, Kenya. 
•	Jumare, H, Visser, M. and Brick, K. (2016).  Determinants of Technology Adoption in Organic Farming: A Look at Urban Smallholder Farmers in Cape Town. Working Paper. Environmental Policy Research Unit. University of Cape Town
•	Jumare, H, Visser, M. and Brick, K. (2016).  The Link between Insurance and Farm Technology Uptake amongst Small Holder Farmers in the Matzikama Municipality: Risk Preferences, Poverty Traps and Timing. Working Paper, Environmental Policy Research Unit. University of Cape Town. 
`,
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
      "Muhammad Kabir Isa is a Professor of Governance & Administration and graduate of Political Science (BSc) from Ahmadu Bello University. He also has M.Sc. and PhD in Political Science from the same university. Professor Isa teaches at the Department of Local Government and Development Studies in the university since September 1992 and a visiting lecturer of Political Science at Gombe State University, from 2006 to 2017. ",
    bio: `Professor Isa has over two decades of extensive research and publication experience, especially in the field of Social Change, Social Movements and Social Transformations, as well as Administrative Sciences with specific focus on Ethnicity and Ethnic Conflicts Management, Age and Youth Studies, Conflict and Peace Studies, Islamism (Political Islam), Terrorism and Militancy, Countering Violent Extremism, Local Government and Management Administration.  He has participated in several international research endeavours, conferences and workshops, and has published several articles, including the following.

•	Nigerian Local Government System and Governance: Lessons, Prospects and Challenges for Post 2015 Development Goals
•	The Youth and Militant Ethnic Movements in Nigeria: The Search for Survival and Identity,
•	The State, Social Movements and Globalisation: The Recurrent of Militant Islamic Groups in Northern Nigeria” 2008; 

Professor Isa has also participated in numerous international conferences such as the IRSPM Research Conference, UK, April 2015 and HEDAYAH-RESOLVE CVE Conference, New York University, Abu Dhabi 2015. He is a pioneer member of RESOLVE (Researching Solutions to Violent Extremism) Network in Nigeria and the research network UNESCO-MOST Ethno-net network. He is also a member of International Research Society for Public Management (IRSPM) 2015.
`,
     socials: [
      { type: "x", url: "#" },
      { type: "instagram", url: "#" },
      { type: "linkedin", url: "#" },
    ],
  },
  {
    name: "Mrs Vivienne Ochee Bamgboye",
    title: "Consultant",
    image: "/mdcl/team/mrsv.jpg",
    profile: "#",
    intro:
      "Vivienne, a consultant with MDCL, has B.A in English/Dramatic Arts from the Ahmadu Bello University, an LL.B Law from the University of Ibadan and a B.L from the Nigerian Law School. Vivienne also has a PG.D in Youth/Social Work. In the last 9 years, she has delivered Capacity/Organizational Development (OD)/Performance Management solutions to a number of retained clients including Dansa Holdings Ltd, Diamond Bank, nahco aviance, NIMASA, Ford Foundation and PEFMB. Vivienne was also the lead researcher for PIND/International Youth Foundation’s “Niger Delta Youth Assessment” and a consultant on the SPRM project of the Governor’s Forum.  ",
    bio: `Between 1994 and 2003 Vivienne worked in the United Kingdom as a Policy Manager/Performance Analyst (2001) in various Local Government Authorities including Camden and Westminster and Harrow, after which she came back to Nigeria to work as Chief Operating Officer in LEAP Africa. She also worked in Vic Lawrence & Associates (VLA) as a Senior Consultant for Learning and Development, before working with the Federal Ministry of Education between 2006 and 2007, as Team Lead for Capacity Building. Most recently, Vivenne has worked as the Lead Organizational Development Consultant for Dansa Holdings Ltd/Dangote Group, Change Management Consultant for the Edo State SEEFOR project, and Organisational Development Consultant for the Propcom/MDCL Capacity Development Support Consultancy for TOOAN. She is currently the Capacity Development Consultant for the Positive Voices Campaign Project. Vivienne Bamgboye is a certified PRINCE 2 Project Manager (OGC), PROSCI Change Management Consultant, CMD Management Consultant/Trainer), and DISC Behavioural Analyst. She also has certificates in Performance Coaching (Coaching Academy UK) and Development Management (Open University, UK). 

Mrs. Bamgboye’s academic qualifications include: B.A Drama - Ahmadu Bello University (1984), LL. B (Bachelor of Laws) - University of Ibadan (1988), B.L (Barrister at Law) Nigerian Law School (1989), PGD in Community and Youth Work – Goldsmiths College, University of London (1998). She also has the following professional qualifications: Certified Learning & Development Practitioner (British Institute for Learning & Development), PRINCE 2 Project Management (OGC UK), Certified Management Trainer (CMD, Nigeria), Certificate in Training Design & Development TAP UK (BILD), Post Graduate Certificate in Development Management (Open University), Microsoft Certified Professional (Workstation, Server, Server in the Enterprise, SQL Server), Train – the - trainer (IT Certified Trainer), DISC Behavioural Analyst (The Trusted Advisor UK), Certificate in Personal Coaching (The Coaching Academy, UK), Prosci Change Management Methodology.

She is currently on the boards of Meyer Plc. and Greenwich Merchant Bank. 
`,
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
                loading="lazy"
                quality={100}
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
        {/* {member.socials?.length > 0 && (
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
        )} */}
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
                  className="w-full h-[35vh] lg:h-[30vh]"
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
