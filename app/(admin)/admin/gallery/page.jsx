"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'; // Assuming Heroicons are available
import Image from 'next/image';

export default function AdminGalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // As requested

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const galleryRef = collection(db, 'gallery');
        // You might want to order these, e.g., by upload date
        const q = query(galleryRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const itemsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGalleryItems(itemsList);
      } catch (error) {
        console.error('Error fetching gallery items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  // Filter items based on search query
  const filteredItems = galleryItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
    // Add more fields to search if necessary, e.g., item.description
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Manage your Gallery</h1>
        <Link href="#" className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors">
          Add to Gallery
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex justify-end mb-6">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <div key={idx} className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
              <div className="w-full h-40 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          No gallery items found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md border-t-4 border-t-green-700">
              {/* Placeholder for image or first image from item.images array */}
              <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center">
                 {/* Replace with actual Image component if item has images */}
                 {item.images && item.images.length > 0 ? (
                   <Image
                     src={item.images[0]}
                     alt={item.title || 'Gallery Image'}
                     fill
                     sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                     className="object-cover"
                   />
                 ) : (
                   <span className="text-gray-400 text-center px-4">No image available</span>
                 )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.title || 'No Title'}</h3>
                {/* Link to view images - placeholder */}
                <Link href={`/admin/gallery/${item.id}`} className="text-sm text-green-700 hover:underline">
                  View Images
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredItems.length > itemsPerPage && (
        <div className="flex items-center justify-end space-x-2 mt-8">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}

    </div>
  );
} 