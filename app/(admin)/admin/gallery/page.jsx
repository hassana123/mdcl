"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { ChevronLeftIcon, ChevronRightIcon, Trash2Icon, PencilIcon } from 'lucide-react'; // Assuming Heroicons are available
import Image from 'next/image';
import AddGalleryItemModal from '@/components/admin/gallery/AddGalleryItemModal'; // Import the modal component
import EditGalleryItemModal from '@/components/admin/gallery/EditGalleryItemModal';

export default function AdminGalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ isOpen: false, item: null });
  const [editModal, setEditModal] = useState({ isOpen: false, item: null });
  const itemsPerPage = 6; // As requested

  // Function to fetch gallery items
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

  useEffect(() => {
    // Call the fetch function inside useEffect
    fetchGalleryItems();
  }, []); // Empty dependency array means this runs once on mount

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

  const handleDelete = async (item) => {
    try {
      setLoading(true);
      
      // Delete all images from storage
      if (item.images && item.images.length > 0) {
        const imageDeletePromises = item.images.map(imageUrl => {
          // Extract the path from the URL
          const decodedUrl = decodeURIComponent(imageUrl);
          const pathMatch = decodedUrl.match(/o\/(.+?)\?/);
          if (pathMatch) {
            const path = pathMatch[1];
            const imageRef = ref(storage, path);
            return deleteObject(imageRef).catch(error => {
              console.error('Error deleting image:', error);
              // Continue with deletion even if one file fails
              return Promise.resolve();
            });
          }
          return Promise.resolve();
        });
        await Promise.all(imageDeletePromises);
      }

      // Delete all videos from storage
      if (item.videos && item.videos.length > 0) {
        const videoDeletePromises = item.videos.map(videoUrl => {
          // Extract the path from the URL
          const decodedUrl = decodeURIComponent(videoUrl);
          const pathMatch = decodedUrl.match(/o\/(.+?)\?/);
          if (pathMatch) {
            const path = pathMatch[1];
            const videoRef = ref(storage, path);
            return deleteObject(videoRef).catch(error => {
              console.error('Error deleting video:', error);
              // Continue with deletion even if one file fails
              return Promise.resolve();
            });
          }
          return Promise.resolve();
        });
        await Promise.all(videoDeletePromises);
      }

      // Delete the document from Firestore
      await deleteDoc(doc(db, 'gallery', item.id));

      // Update the UI
      setGalleryItems(prevItems => prevItems.filter(i => i.id !== item.id));
      setDeleteConfirmModal({ isOpen: false, item: null });
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Failed to delete gallery item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Manage your Gallery</h1>
        {/* Change Link to button and add onClick handler */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
        >
          Add to Gallery
        </button>
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
              <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center">
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
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.title || 'No Title'}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditModal({ isOpen: true, item })}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit item"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmModal({ isOpen: true, item })}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete item"
                    >
                      <Trash2Icon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 bg-gray-700/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteConfirmModal.item?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirmModal({ isOpen: false, item: null })}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmModal.item)}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Gallery Item Modal */}
      <EditGalleryItemModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, item: null })}
        onGalleryItemUpdated={fetchGalleryItems}
        item={editModal.item}
      />

      {/* Render the Add Gallery Item Modal */}
      <AddGalleryItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGalleryItemAdded={fetchGalleryItems} // Refetch items after adding a new one
      />

    </div>
  );
} 