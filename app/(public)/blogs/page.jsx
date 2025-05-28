"use client";
import React, { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import Image from "next/image";
import Deco from "@/components/Deco";
import Link from "next/link"; 
import Partners from "@/components/Partners";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, 'blogs');
        const q = query(blogsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const blogsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlogs(blogsList);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const getPreviewText = (blog) => {
    let text = '';
    if (blog.layoutType === 'standard') {
      text = blog.content;
    } else if (blog.layoutType === 'sectioned') {
      text = blog.sections[0]?.description || '';
    } else if (blog.layoutType === 'introduction-conclusion') {
      text = blog.introduction;
    }
    
    // Get first 15-20 words
    const words = text.split(/\s+/).slice(0, 20).join(' ');
    return words.length < text.length ? `${words} [...]` : words;
  };

  return (
    <main className="bg-white min-h-screen w-full">
      {/* Banner */}
      <Banner
        title="Blog"
        subtitle={
          <span className="text-center font-medium text-white/70">
            <Link href="/" className="hover:underline">Home</Link> /{" "}
            <Link href="/blog" className="text-white font-bold text-white hover:underline">Blog</Link>
          </span>
        }
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
          Here's a quick glance at our blog posts
        </p>
      </section>

      {/* Blog Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden max-w-sm mx-auto animate-pulse">
              <div className="relative w-full h-48 bg-gray-200"></div>
              <div className="p-5 flex flex-col flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden max-w-sm mx-auto hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative w-full h-48">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  loading="lazy"
                  quality={100}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-lg text-[var(--color-title-text)] mb-2 hover:underline">
                  <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
                </h3>
                <p className="text-sm text-gray-700 flex-1 mb-4">
                  {getPreviewText(blog)}
                </p>
                <Link
                  href={`/blogs/${blog.id}`}
                  className="text-[color:var(--color-primary-olive)] font-semibold text-sm hover:underline mt-auto flex items-center gap-1"
                >
                  Read More <span className="text-lg">→</span>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-600">No blog posts available at the moment.</p>
          </div>
        )}
      </section>

      {/* Logos Row */}
      <Partners/>
    </main>
  );
}
