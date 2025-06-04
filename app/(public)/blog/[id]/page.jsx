"use client";
import React, { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Partners from "@/components/Partners";
import { useParams } from 'next/navigation';

export default function BlogPostPage() {
  const params = useParams();
  const { id } = params;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogRef = doc(db, 'blogs', id);
        const blogSnap = await getDoc(blogRef);
        
        if (blogSnap.exists()) {
          setBlog({ id: blogSnap.id, ...blogSnap.data() });
        } else {
          setError("Blog post not found");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatParagraphs = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  const renderContent = () => {
    if (!blog) return null;

    switch (blog.layoutType) {
      case 'standard':
        return (
          <div className="prose max-w-none">
            {formatParagraphs(blog.content)}
          </div>
        );

      case 'sectioned':
        return (
          <div className="space-y-8">
            {blog.sections.map((section, index) => (
              <div key={index} className="mb-8">
                {section.title && (
                  <h3 className="text-xl font-semibold text-[var(--color-title-text)] mb-4">
                    {section.title}
                  </h3>
                )}
                <div className="prose max-w-none">
                  {formatParagraphs(section.description)}
                </div>
              </div>
            ))}
          </div>
        );

      case 'introduction-conclusion':
        return (
          <div className="space-y-8">
            {/* Introduction */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[var(--color-title-text)] mb-4">
                Introduction
              </h3>
              <div className="prose max-w-none">
                {formatParagraphs(blog.introduction)}
              </div>
            </div>

            {/* Sections */}
            {blog.sections.map((section, index) => (
              <div key={index} className="mb-8">
                {section.title && (
                  <h3 className="text-xl font-semibold text-[var(--color-title-text)] mb-4">
                    {section.title}
                  </h3>
                )}
                <div className="prose max-w-none">
                  {formatParagraphs(section.description)}
                </div>
              </div>
            ))}

            {/* Conclusion */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[var(--color-title-text)] mb-4">
                Conclusion
              </h3>
              <div className="prose max-w-none">
                {formatParagraphs(blog.conclusion)}
              </div>
            </div>
          </div>
        );

      default:
        return <p>Invalid blog layout type</p>;
    }
  };

  if (loading) {
    return (
      <main className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Link href="/blogs" className="text-[var(--color-primary-olive)] underline">
            Back to Blogs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Banner */}
      <Banner
        title={blog.title}
        subtitle={
          <span className="text-center font-medium text-white/70">
            <Link href="/" className="hover:underline">Home</Link> /{" "}
            <Link href="/blog" className="hover:underline">Blog</Link> /{" "}
            <span className="text-white font-bold">Blog Post</span>
          </span>
        }
      />

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Cover Image */}
        <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>

        {/* Blog Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-title-text)] mb-8">
          {blog.title}
        </h1>

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none">
          {renderContent()}
        </div>

        {/* Back to Blogs Link */}
        <div className="mt-12 pt-8 border-t">
          <Link
            href="/blogs"
            className="text-[var(--color-primary-olive)] font-semibold hover:underline flex items-center gap-2"
          >
            <span>←</span> Back to Blogs
          </Link>
        </div>
      </article>

      {/* Partners Section */}
      <Partners />
    </main>
  );
} 