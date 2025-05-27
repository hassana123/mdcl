import React from 'react'
import Banner from '@/components/Banner';
import Deco from "@/components/Deco";
import Partners from '@/components/Partners';
import Link from 'next/link';
import Image from 'next/image';
const solutions = [
  {
    icon:"/mdcl/icon (1).png",
    title: "Consulting and Advisory Services",
    desc: "Institutional capacity building, agribusiness development, and policy consulting to Governments, NGOs, development agencies, and private agribusinesses.",
  },
  {
     icon:"/mdcl/icon (2).png",
    title: "Training and Capacity Development",
    desc: "Workshops, online courses, in-person training programmes for women entrepreneurs, cooperatives, corporate agribusinesses, and donor organisations.",
  },
  {
     icon:"/mdcl/icon (3).png",
    title: "Research and Data Services",
    desc: "Market research, feasibility studies, policy reports. Target audience – development agencies, government, and investors.",
  },
  {
     icon:"/mdcl/icon (1).png",
    title: "Agribusiness Incubation & Market Linkage Services",
    desc: "Mentorship, access to finance, digital platforms, and aggregation hubs for women-led agribusinesses, cooperatives, financial institutions.",
  },
  {
    icon:"/mdcl/icon (1).png",
    title: "Events and Conferences",
    desc: "Industry events, networking summits, policy dialogues for development agencies, government, cooperatives, and corporate stakeholders.",
  },
];

const Solutions = () => {
  return (
    <main className="bg-white min-h-screen">
      <Banner
        title="Our Solutions"
        subtitle={
          <span className="text-center font-medium text-white/70">
            <Link href="/" className="hover:underline">Home</Link> /{" "}
            <Link href="/solution" className="hover:underline text-white  font-bold">Our Solutions</Link>
          </span>
        }
        image="/mdcl/g4.jpg"
      />
  <div className="lg:block hidden md:w-[85%] mx-auto">
    <Deco/>
   </div>
      <div className='mt-20 mb-10 md:w-[85%] w-[95%] mx-auto text-center'>
        <div className='md:w-[60%] mx-auto'>
          <h1 className='uppercase text-2xl mb-3 font-bold text-[var(--color-primary-olive)]'>OUR SOLUTIONS AT A GLANCE</h1>
        <p className='text-md text-gray-700 mb-10'>Our services are designed to meet the evolving needs of women in agriculture, as well as the diverse stakeholders who support and empower them within the agricultural sector.</p>
        </div>
        <div className=" mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left mb-8">
          {solutions.slice(0, 3).map((solution, index) => (
            <div key={index} className="bg-white border-l-[4px] border-[var(--color-primary-light-brown)] p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              {/* Icon Placeholder */}
              <Image alt='icon' className='mx-auto mb-5' src={solution.icon} width={100} height={100} />
              {/* <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div> */}
              <div className="font-bold text-[17px] mb-2">{solution.title}</div>
              <div className="text-gray-700 text-[15px]">{solution.desc}</div>
            </div>
          ))}
        </div>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {solutions.slice(3).map((solution, index) => (
            <div key={index} className="bg-white border-l-[4px] border-[var(--color-primary-light-brown)] p-6 rounded-lg shadow-md flex flex-col items-center text-center">
             <Image alt='icon' className='mx-auto mb-5' src={solution.icon} width={100} height={100} />
              {/* <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div> */}
            
              <div className="font-bold text-[17px] mb-2">{solution.title}</div>
              <div className="text-gray-700 text-[15px]">{solution.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <Partners/>
    </main>
  )
}

export default Solutions