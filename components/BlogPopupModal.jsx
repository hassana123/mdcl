"use client";

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { X, Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const categoryMap = {
  'research': 'research',
  'project-management': 'project-management',
  'capacity-development': 'capacity-development'
};

const getProjectCategorySlug = (cat) => {
  if (!cat) return 'projects-&-programmes';
  const normalized = cat.toLowerCase().replace(/ /g, '-');
  return categoryMap[normalized] || normalized;
};

const BlogPopupModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if popup has been shown in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenBlogPopup');
    
    if (!hasSeenPopup) {
      const fetchActiveAnnouncement = async () => {
        try {
          setLoading(true);
          const announcementsRef = collection(db, 'announcements');
          const q = query(
            announcementsRef,
            where('status', '==', 'active'),
            orderBy('timestamp', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const announcementsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          if (announcementsList.length > 0) {
            // Get the most recent active announcement
            setAnnouncement(announcementsList[0]);
            setIsOpen(true);
          } else {
            setAnnouncement(null);
            setIsOpen(false);
          }
          setLoading(false);
        } catch (err) {
          console.error("Error fetching announcement:", err);
          setError("Failed to load announcement.");
          setLoading(false);
        }
      };

      fetchActiveAnnouncement();
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark popup as seen in this session
   sessionStorage.setItem('hasSeenBlogPopup', 'true');
  };
//sessionStorage.clear()
  // const handleReadMore = (e) => {
  //   e?.preventDefault?.();
  //   handleClose();
  //   // Navigate to the appropriate page based on source type
  //   if (announcement?.sourceType) {
  //     const sourceType = announcement.sourceType.toLowerCase();
  //     const sourceId = announcement.sourceId;
  //     switch (sourceType) {
  //       case 'blog':
  //         window.location.href = `/blog/${sourceId}`;
  //         break;
  //       case 'newsletter':
  //         const pdfAttachment = announcement.attachments?.find(a => a.type === 'pdf');
  //         if (pdfAttachment?.url) {
  //           window.open(pdfAttachment.url, '_blank');
  //         }
  //         break;
  //       case 'project':
  //         // Use the stored category for the route
  //         window.location.href = `/projects-&-programmes/${announcement.category}/${sourceId}`;
  //         break;
  //     }
  //   }
  // };

  const truncateDescription = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const handleReadMoreUrl = () => {
    if (!announcement?.sourceType) return '#';
    const sourceType = announcement.sourceType.toLowerCase();
    const sourceId = announcement.sourceId;
   sessionStorage.setItem('hasSeenBlogPopup', 'true');

    switch (sourceType) {
      case 'blog':
        return `/blog/${sourceId}`;
      case 'project':
        return `/projects-&-programmes/${getProjectCategorySlug(announcement.category)}/${sourceId}`;
      default:
        return '#';
    }

  };

  const getNewsletterPdfUrl = () => {
    if (announcement?.sourceType?.toLowerCase() === 'newsletter') {
      const pdfAttachment = announcement.attachments?.find(a => a.type === 'pdf');
      if (pdfAttachment?.url) return pdfAttachment.url;
    }
    return null;
  };

  if (!isOpen) return null;

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
          <p>Loading announcement...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : announcement ? (
          <>
            <div className="flex mb-10 items-center gap-4 w-[100%]">
              {/* Text Content */}
              <div className="w-full">
                <h3 className="text-2xl font-bold text-gray-800 mb-1 leading-snug">
                  {announcement.title || 'Untitled Announcement'}
                </h3>
                {announcement.sourceType === 'project' && announcement.projectCategory && (
                  <div className="text-xs text-gray-500 mb-2">
                    {announcement.projectCategory}
                  </div>
                )}
                <p className="text-gray-600 text-sm leading-relaxed mb-2">
                  {truncateDescription(announcement.content, 150) || 'No description available.'}
                </p>
              </div>
              {/* Image */}
              {announcement.coverImage && (
                <div className="w-[90%] relative rounded overflow-hidden">
                  <Image
                    src={announcement.coverImage}
                    alt={announcement.title || 'Announcement Cover'}
                    width={1000}
                    height={1000}
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            {/* Read More Button */}
            <div className="mt-6 text-center">
              {announcement.sourceType === 'newsletter' && getNewsletterPdfUrl() ? (
                <a
                  href={getNewsletterPdfUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--color-primary-light-brown)] w-full block text-white py-3 rounded-md hover:bg-[var(--color-primary-brown)] transition-colors text-center"
                >
                  Read More
                </a>
              ) : (
                <Link
                  href={handleReadMoreUrl()}
                  className="bg-[var(--color-primary-light-brown)] w-full block text-white py-3 rounded-md hover:bg-[var(--color-primary-brown)] transition-colors text-center"
                >
                  Read More
                </Link>
              )}
            </div>
          </>
        ) : (
          <p>No announcements available.</p>
        )}
      </div>
    </div>
  );
};

export default BlogPopupModal; 