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

// Local storage keys
const SEEN_ANNOUNCEMENTS_KEY = 'seenAnnouncements';
const LAST_CHECK_KEY = 'lastAnnouncementCheck';

const BlogPopupModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get seen announcements from localStorage
  const getSeenAnnouncements = () => {
    try {
      const seen = localStorage.getItem(SEEN_ANNOUNCEMENTS_KEY);
      return seen ? JSON.parse(seen) : [];
    } catch (error) {
      console.error('Error reading seen announcements:', error);
      return [];
    }
  };

  // Mark announcement as seen
  const markAnnouncementAsSeen = (announcementId) => {
    try {
      const seenAnnouncements = getSeenAnnouncements();
      if (!seenAnnouncements.includes(announcementId)) {
        seenAnnouncements.push(announcementId);
        localStorage.setItem(SEEN_ANNOUNCEMENTS_KEY, JSON.stringify(seenAnnouncements));
      }
      // Update last check timestamp
      localStorage.setItem(LAST_CHECK_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving seen announcement:', error);
    }
  };

  // Clean up old seen announcements (optional - keeps storage clean)
  const cleanupOldSeenAnnouncements = (activeAnnouncementIds) => {
    try {
      const seenAnnouncements = getSeenAnnouncements();
      const validSeenAnnouncements = seenAnnouncements.filter(id => 
        activeAnnouncementIds.includes(id)
      );
      localStorage.setItem(SEEN_ANNOUNCEMENTS_KEY, JSON.stringify(validSeenAnnouncements));
    } catch (error) {
      console.error('Error cleaning up seen announcements:', error);
    }
  };

  useEffect(() => {
    const fetchNewAnnouncement = async () => {
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
          const seenAnnouncements = getSeenAnnouncements();
          const activeAnnouncementIds = announcementsList.map(a => a.id);
          
          // Clean up old seen announcements
          cleanupOldSeenAnnouncements(activeAnnouncementIds);
          
          // Find the first unseen announcement (most recent first)
          const unseenAnnouncement = announcementsList.find(announcement => 
            !seenAnnouncements.includes(announcement.id)
          );

          if (unseenAnnouncement) {
            setAnnouncement(unseenAnnouncement);
            setIsOpen(true);
          } else {
            setAnnouncement(null);
            setIsOpen(false);
          }
        } else {
          setAnnouncement(null);
          setIsOpen(false);
        }
      } catch (err) {
        console.error("Error fetching announcement:", err);
        setError("Failed to load announcement.");
      } finally {
        setLoading(false);
      }
    };

    // Always check for new announcements when component mounts
    fetchNewAnnouncement();
  }, []);

  const handleClose = () => {
    if (announcement) {
      markAnnouncementAsSeen(announcement.id);
    }
    setIsOpen(false);
  };

  const handleReadMore = () => {
    if (announcement) {
      markAnnouncementAsSeen(announcement.id);
    }
    setIsOpen(false);
  };

  const truncateDescription = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const handleReadMoreUrl = () => {
    if (!announcement?.sourceType) return '#';
    const sourceType = announcement.sourceType.toLowerCase();
    const sourceId = announcement.sourceId;

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

  // Optional: Add a method to reset all seen announcements (for testing or admin purposes)
  const resetSeenAnnouncements = () => {
    localStorage.removeItem(SEEN_ANNOUNCEMENTS_KEY);
    localStorage.removeItem(LAST_CHECK_KEY);
  };

  // Optional: Expose reset function to window for debugging (remove in production)
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      window.resetSeenAnnouncements = resetSeenAnnouncements;
    }
  }, []);

  if (!isOpen || loading) return null;

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
          <span>New Announcement</span>
        </div>

        {error ? (
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
                {/* Show announcement timestamp */}
                {announcement.timestamp && (
                  <div className="text-xs text-gray-400 mb-2">
                    Posted: {new Date(announcement.timestamp.toDate?.() || announcement.timestamp).toLocaleDateString()}
                  </div>
                )}
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
                  onClick={handleReadMore}
                  className="bg-[var(--color-primary-light-brown)] w-full block text-white py-3 rounded-md hover:bg-[var(--color-primary-brown)] transition-colors text-center"
                >
                  Read More
                </a>
              ) : (
                <Link
                  href={handleReadMoreUrl()}
                  onClick={handleReadMore}
                  className="bg-[var(--color-primary-light-brown)] w-full block text-white py-3 rounded-md hover:bg-[var(--color-primary-brown)] transition-colors text-center"
                >
                  Read More
                </Link>
              )}
            </div>
          </>
        ) : (
          <p>No new announcements available.</p>
        )}
      </div>
    </div>
  );
};

export default BlogPopupModal;