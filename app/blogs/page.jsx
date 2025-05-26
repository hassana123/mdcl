"use client";
import React from "react";
import Banner from "../../components/Banner";
import Image from "next/image";
import Deco from "@/components/Deco";
import Link from "next/link"; 
import Partners from "@/components/Partners";
const blogs = [
  {
    image: "/mdcl/b1.jpg",
    title: "Educating Girls: A pathway to sustainable development",
    excerpt:
      "Although progress has been recorded in recent years, girls all through their lives have continually suffered severe disadvantage and marginalization in education systems in Sub-Saharan Africa. For example, an estimated 31 [...]",
    link: "#",
  },
  {
    image: "/mdcl/b2.jpg",
    title: "Is the nigeria coin lost and gone?",
    excerpt:
      "The main idea of having the coin as part of the Nigerian currency was to house the 'minor unit' of the naira. At the early stages of its introduction, the kobo [...]",
    link: "#",
  },
  {
    image: "/mdcl/b3.jpg",
    title: "My take on development",
    excerpt:
      "Philosophers, economists and political leaders have stressed that human wellbeing is the main driver of development. I believe human development is empowerment; it is about people taking control of their own [...]",
    link: "#",
  },
];

const logos = [
  "/mdcl/logo1.png",
  "/mdcl/logo2.png",
  "/mdcl/logo3.png",
  "/mdcl/logo4.png",
  "/mdcl/logo5.png",
  "/mdcl/logo6.png",
];

export default function BlogPage() {
  return (
    <main className="bg-white min-h-screen w-full">
      {/* Banner */}
     <Banner
  title="Blog"
  subtitle={
    <span className="text-center font-medium text-white/70">
      <Link href="/" className="hover:underline ">Home</Link> /{" "}
      <Link href="/blog" className="text-white font-bold text-white hover:underline ">Blog</Link>
    </span>
  }
  image="/mdcl/g1.jpg"
/>
<div className="lg:block hidden md:w-[85%] mx-auto">
    <Deco/>
   </div>
      {/* Section Title and Subtitle */}
      <section className="max-w-6xl mx-auto px-4 mt-20 mb-10 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-title-text)] text-center mb-2">
         Blog Posts
        </h2>
        <p className="text-base text-gray-700 text-center mb-8 max-w-xl">
          Here's a quick glance over our  blog posts 
        </p>
      </section>

      {/* Blog Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[...blogs, ...blogs].map((blog, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden max-w-sm mx-auto"
          >
            <div className="relative w-full h-48">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={idx === 0}
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-semibold text-lg text-[var(--color-title-text)] mb-2 underline">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-700 flex-1 mb-4">
                {blog.excerpt}
              </p>
              <a
                href={blog.link}
                className="text-[color:var(--color-primary-olive)] font-semibold text-sm hover:underline mt-auto flex items-center gap-1"
              >
                Read More <span className="text-lg">→</span>
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* Logos Row */}
     <Partners/>
    </main>
  );
}
