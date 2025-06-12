"use client";

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { X, Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const BlogPopupModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if popup has been shown in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenBlogPopup');
    
    if (!hasSeenPopup) {
      const fetchRandomBlogPost = async () => {
        try {
          setLoading(true);
          const blogsRef = collection(db, 'blogs');
          const q = query(blogsRef);
          const querySnapshot = await getDocs(q);
          const blogsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          if (blogsList.length > 0) {
            const randomIndex = Math.floor(Math.random() * blogsList.length);
            setBlogPost(blogsList[randomIndex]);
            setIsOpen(true);
          } else {
            setBlogPost(null);
            setIsOpen(false);
          }
          setLoading(false);
        } catch (err) {
          console.error("Error fetching random blog post:", err);
          setError("Failed to load blog post.");
          setLoading(false);
        }
      };

      fetchRandomBlogPost();
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Set flag in sessionStorage to indicate popup has been seen
    sessionStorage.setItem('hasSeenBlogPopup', 'true');
  };

  const handleReadMore = () => {
    setIsOpen(false);
    // Set flag in sessionStorage to indicate popup has been seen
    sessionStorage.setItem('hasSeenBlogPopup', 'true');
  };

  // Keep modal open after loading unless manually closed
  if (!isOpen || loading || !blogPost) return null;

  // Function to truncate description
  const truncateDescription = (text, length) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + ' [...]';
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[50%] relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center text-gray-600 mb-4">
          <Bell size={25} className="mr-1 text-[var(--color-primary-light-brown)]" />
          <span>Announcement</span>
        </div>

        {loading ? (
          <p>Loading blog post...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : blogPost ? (
          <>
            <div className="flex mb-10 items-center gap-4 w-[100%]">
              {/* Text Content */}
              <div className="w-full">
                <h3 className="text-3xl underline font-bold text-gray-800 mb-2 leading-snug">
                  {blogPost.title || 'Untitled Blog Post'}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {blogPost.sections && blogPost.sections.length > 0 && blogPost.sections[0].description
                    ? truncateDescription(blogPost.sections[0].description, 150)
                    : 'No description available.'
                  }
                </p>
              </div>

              {/* Image */}
              {blogPost.image && (
                <div className="w-[90%] relative rounded overflow-hidden">
                  <Image
                    src={blogPost.image}
                    alt={blogPost.title || 'Blog Cover'}
                    width={1000}
                    height={1000}
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Read More Button */}
            <div className="mt-6 text-center">
              <Link href={`/blog/${blogPost.id}`} onClick={handleReadMore}>
                <button className="bg-[var(--color-primary-light-brown)] w-full text-white py-3 rounded-md hover:bg-[var(--color-primary-brown)] transition-colors">
                  Read More
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p>No blog posts available.</p>
        )}
      </div>
    </div>
  );
};

export default BlogPopupModal; 