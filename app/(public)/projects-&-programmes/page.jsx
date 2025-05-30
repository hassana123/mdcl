"use client";

import React from 'react';
import Link from 'next/link';
import Banner from "@/components/Banner";
import Deco from "@/components/Deco";
import PreviewProjects from "@/components/PreviewProjects";
import Partners from "@/components/Partners";

const categories = [
  { id: '1', name: 'Research', description: 'Research related projects', path: '/projects/research' },
  { id: '2', name: 'Project Management', description: 'Project management related projects', path: '/projects/project-management' },
  { id: '3', name: 'Capacity Development', description: 'Capacity development related projects', path: '/projects/capacity-development' }
];

export default function ProjectsPage() {
  return (
    <main className="bg-white ">
      <Banner
        title="Projects & Programmes"
        subtitle={
          <span className="text-center font-medium text-white/70">
            <Link href="/" className="hover:underline">Home</Link> /{" "}
            <Link href="/projects" className="hover:underline text-white font-bold">Projects & Programmes</Link>
          </span>
        }
        
      />
   <div className="lg:block hidden md:w-[85%] mx-auto">
 <div className="lg:block hidden mt-20 md:w-[85%] mx-auto">
    <Deco/>
   </div>
   </div>
      {/* <div className="mt-5 mb-20 text-center">
        <h1 className="uppercase text-2xl mb-5 font-bold text-[var(--color-title-text)]">Projects & Programmes</h1>
        <p className="text-md text-gray-700">Our services are designed to meet the evolving needs of development actors.</p>
      </div> */}
      <PreviewProjects />
      <Partners />
     
    </main>
  );
}
