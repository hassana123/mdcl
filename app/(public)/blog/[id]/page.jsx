"use client";
import React, { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Partners from "@/components/Partners";
import { useParams } from 'next/navigation';
import { Facebook, Twitter, Linkedin, Share2, MessageCircle } from 'lucide-react';
import Head from 'next/head';

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

  // Format date for meta description
  const formattedDate = blog.publishDate?.toDate 
    ? new Date(blog.publishDate.toDate()).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : blog.publishDate;

  // Get ISO date string safely
  const getISODate = (date) => {
    if (!date) return new Date().toISOString();
    if (date.toDate) return date.toDate().toISOString();
    if (date instanceof Date) return date.toISOString();
    return new Date(date).toISOString();
  };

  return (
    <>
      <Head>
        <title>{`${blog.title} | MDCL Blog`}</title>
        <meta name="description" content={blog.excerpt || blog.content?.substring(0, 160)} />
        <meta name="author" content={blog.postedBy || "MDCL"} />
        <meta name="keywords" content={blog.tags?.join(', ') || 'development, consulting, Nigeria'} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt || blog.content?.substring(0, 160)} />
        <meta property="og:image" content={blog.image} />
        <meta property="og:url" content={`https://mdcl.com.ng/blog/${id}`} />
        <meta property="article:published_time" content={getISODate(blog.publishDate)} />
        <meta property="article:author" content={blog.postedBy || "MDCL"} />
        {blog.tags?.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt || blog.content?.substring(0, 160)} />
        <meta name="twitter:image" content={blog.image} />
      </Head>

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
        <article className="max-w-4xl mx-auto px-4 py-12 text-justify">
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
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-title-text)] mb-4">
            {blog.title}
          </h1>

          {/* Date and Author */}
          <div className="flex items-center gap-4 text-gray-600 mb-8">
            <span>Posted on: {formattedDate}</span>
            {blog.postedBy && (
              <span>• By {blog.postedBy}</span>
            )}
          </div>

          {/* Blog Content */}
          <div className="prose prose-lg max-w-none">
            {renderContent()}
          </div>

          {/* Social Share Section */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Share This Story, Choose Your Platform!
            </h3>
            <div className="flex items-center gap-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${blog.title} ${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="p-2 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                aria-label="Copy link"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Back to Blogs Link */}
          <div className="mt-8">
            <Link
              href="/blog"
              className="text-[var(--color-primary-olive)] font-semibold hover:underline flex items-center gap-2"
            >
              <span>←</span> Back to Blog
            </Link>
          </div>
        </article>

        {/* Partners Section */}
        <Partners />
      </main>
    </>
  );
} 