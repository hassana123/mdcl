import React from 'react'
import Banner from "../../components/Banner";
import Deco from "@/components/Deco";
import Partners from '@/components/Partners';
import Link from 'next/link';

const solutions = [
  {
    title: "Consulting and Advisory Services",
    desc: "Institutional capacity building, agribusiness development, and policy consulting to Governments, NGOs, development agencies, and private agribusinesses.",
  },
  {
    title: "Training and Capacity Development",
    desc: "Workshops, online courses, in-person training programmes for women entrepreneurs, cooperatives, corporate agribusinesses, and donor organisations.",
  },
  {
    title: "Research and Data Services",
    desc: "Market research, feasibility studies, policy reports. Target audience – development agencies, government, and investors.",
  },
  {
    title: "Agribusiness Incubation & Market Linkage Services",
    desc: "Mentorship, access to finance, digital platforms, and aggregation hubs for women-led agribusinesses, cooperatives, financial institutions.",
  },
  {
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
      <Deco />
      <div className='mt-20 mb-10 text-center'>
        <h1 className='uppercase text-2xl mb-3 font-bold text-[var(--color-primary-olive)]'>THE SOLUTIONS WE OFFER</h1>
        <p className='text-md text-gray-700 mb-10'>Our services are designed to meet the evolving needs of development actors.</p>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="space-y-8">
            <div>
              <div className="font-bold text-[17px] mb-1">Consulting and Advisory Services</div>
              <div className="text-gray-700 text-[15px]">Institutional capacity building, agribusiness development, and policy consulting to Governments, NGOs, development agencies, and private agribusinesses.</div>
            </div>
            <div>
              <div className="font-bold text-[17px] mb-1">Research and Data Services</div>
              <div className="text-gray-700 text-[15px]">Market research, feasibility studies, policy reports. Target audience – development agencies, government, and investors.</div>
            </div>
            <div>
              <div className="font-bold text-[17px] mb-1">Events and Conferences</div>
              <div className="text-gray-700 text-[15px]">Industry events, networking summits, policy dialogues for development agencies, government, cooperatives, and corporate stakeholders.</div>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <div className="font-bold text-[17px] mb-1">Training and Capacity Development</div>
              <div className="text-gray-700 text-[15px]">Workshops, online courses, in-person training programmes for women entrepreneurs, cooperatives, corporate agribusinesses, and donor organisations.</div>
            </div>
            <div>
              <div className="font-bold text-[17px] mb-1">Agribusiness Incubation & Market Linkage Services</div>
              <div className="text-gray-700 text-[15px]">Mentorship, access to finance, digital platforms, and aggregation hubs for women-led agribusinesses, cooperatives, financial institutions.</div>
            </div>
          </div>
        </div>
      </div>
      <Partners/>
    </main>
  )
}

export default Solutions