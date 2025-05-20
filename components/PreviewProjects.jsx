import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
const PreviewProjects = () => {
    const items = [
  {
    src: "/mdcl/p3.svg",
    title: "Resarch",
    link:"",
    description:
      "We believe in driving evidence-based policy through actionable research. By supporting organizations to conduct studies, gathering data, and turning insights into impactful programs and reports.",
  },
  {
    src: "/mdcl/p1.svg",
    title: "Project Management",
     link:"",
    description:
      "Good planning and evaluation lead to successful, lasting projects. At MDCL, we support development agencies in designing, managing, and assessing social impact projects for better outcomes.",
  },
  {
    src: "/mdcl/p2.svg",
    title: "Capacity Development",
     link:"",
    description:
      "Strong institutions drive sustainable impact. MDCL helps organizations build capacity through needs assessments, training, mentorship, and tailored workshops to improve service delivery.",
  },
];
  return (
    <div className='w-[85%] mx-auto'>
        <div className="flex justify-between items-center my-10">
          <div>
            <h3 className="text-[var(--color-primary-olive)] text-[30px] font-bold my-3">POJECTS & PROGRAMMES</h3>
            <p className="text-[#1C1C1C]">
              Our Projects are designed to meet the evolving needs of
              development actors.
            </p>
          </div>
          <button className="bg-[var(--color-primary-brown)] text-white px-8 py-3 rounded-xl text-lg  shadow hover:bg-[color:var(--color-primary-brown)]/90 transition">
            View Programmes
          </button>
        </div>
        <section className="grid md:grid-cols-3 gap-10">
      {items.map((item, index) => (
        <div className="space-y-5" key={index}>
         <div className='bg-[var(--color-primary-olive)]  rounded-full flex justify-center items-center w-24 h-24'>
             <Image
            src={item.src}
            alt={item.title}
            width={65}
            height={50}
            className=" "
          />
         </div>
          <h4 className="mt-4 font-semibold text-[#323539] text-[26px]">{item.title}</h4>
          <p className="text-[#1E1E1ECC]/80 text-justify">{item.description}</p>
          <Link className='text-[var(--color-primary-brown)] font-semibold underline flex  items-center space-x-2'  href={item.link}>View Projects <ArrowRight/></Link>
        </div>
      ))}
    </section>  </div>

  )
}

export default PreviewProjects