"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const PreviewBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, 'blogs');
        const q = query(
          blogsRef,
          orderBy('publishDate', 'desc'),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlogs(blogsData);
        setLoading(false);
      } catch (e) {
        console.error("Error fetching blogs:", e);
        setError("Failed to load blogs");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="w-[85%] mx-auto py-16 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-title-text)] text-center mb-5">
          Blog Posts
        </h2>
        <div className="w-full flex flex-col md:flex-row gap-6 justify-center items-stretch">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md flex-1 flex flex-col overflow-hidden max-w-sm mx-auto animate-pulse">
              <div className="w-full h-48 bg-gray-200" />
              <div className="p-5 flex flex-col flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="space-y-2 flex-1 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-4/6" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-[85%] mx-auto py-16 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-title-text)] text-center mb-5">
          Blog Posts
        </h2>
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="w-[85%] mx-auto py-16 flex flex-col items-center">
      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-title-text)] text-center mb-5">
        Blog Posts
      </h2>

      <Link href="/blog" className="mb-10 bg-[var(--color-primary-light-brown)] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-[color:var(--color-primary-brown)]/90 transition">
        View Blog
      </Link>

      {/* Blog Cards */}
      <div className="w-full flex flex-col md:flex-row gap-6 justify-center items-stretch">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-xl shadow-md flex-1 flex flex-col overflow-hidden max-w-sm mx-auto"
          >
            <div className="relative w-full h-48">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={blog.id === blogs[0]?.id}
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-semibold text-lg text-[var(--color-title-text)] mb-2">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-700 flex-1 mb-4">
                {getPreviewText(blog)}
              </p>
              <Link
                href={`/blog/${blog.id}`}
                className="text-[color:var(--color-primary-olive)] font-semibold text-sm hover:underline mt-auto"
              >
                Read More &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PreviewBlog;