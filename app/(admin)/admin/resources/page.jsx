"use client";
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, Edit2Icon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import AddNewsletterModal from '@/components/admin/resources/AddNewsletterModal';
import AddFAQModal from '@/components/admin/resources/AddFAQModal';
import AddPolicyModal from '@/components/admin/resources/AddPolicyModal';

export default function AdminResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('newsletter');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const itemsPerPage = 6;

  const fetchResources = async () => {
    try {
      const resourcesRef = collection(db, 'resources');
      const q = query(resourcesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const resourcesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResources(resourcesList);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Filter items based on search query and category
  const filteredItems = resources.filter(item =>
    item.category === selectedCategory &&
    (item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (item) => {
    setEditData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setDeleteLoading(true);
    try {
      // Delete files from storage
      if (item.coverImage) {
        const coverImageRef = ref(storage, item.coverImage);
        await deleteObject(coverImageRef);
      }
      if (item.pdfUrl) {
        const pdfRef = ref(storage, item.pdfUrl);
        await deleteObject(pdfRef);
      }

      // Delete document from Firestore
      await deleteDoc(doc(db, 'resources', item.id));
      
      // Refresh the resources list
      await fetchResources();
    } catch (err) {
      console.error("Error deleting resource:", err);
      alert("Failed to delete resource. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const renderAddButton = () => {
    switch (selectedCategory) {
      case 'newsletter':
        return (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
          >
            Add Newsletter
          </button>
        );
      case 'faq':
        return (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
          >
            Add FAQ
          </button>
        );
      case 'policy':
        return (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
          >
            Add Policy
          </button>
        );
      default:
        return null;
    }
  };

  const renderModal = () => {
    switch (selectedCategory) {
      case 'newsletter':
        return (
          <AddNewsletterModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onResourceAdded={fetchResources}
            editData={editData}
          />
        );
      case 'faq':
        return (
          <AddFAQModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onResourceAdded={fetchResources}
            editData={editData}
          />
        );
      case 'policy':
        return (
          <AddPolicyModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onResourceAdded={fetchResources}
            editData={editData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Manage Resources</h1>
        {renderAddButton()}
      </div>

      {/* Category Selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedCategory('newsletter')}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === 'newsletter'
                ? 'bg-green-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Newsletters
          </button>
          <button
            onClick={() => setSelectedCategory('faq')}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === 'faq'
                ? 'bg-green-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            FAQs
          </button>
          <button
            onClick={() => setSelectedCategory('policy')}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === 'policy'
                ? 'bg-green-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Policies
          </button>
        </div>
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

      {/* Resources Grid */}
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
          No resources found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md border-t-4 border-t-green-700">
              {(selectedCategory === 'newsletter' || selectedCategory === 'faq') && item.coverImage && (
                <div className="relative w-full h-40 bg-gray-100">
                  <Image
                    src={item.coverImage}
                    alt={item.title || 'Cover Image'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.title || 'No Title'}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                )}
                <div className="flex justify-between items-center mt-4">
                  {(selectedCategory === 'newsletter' || selectedCategory === 'faq') && item.pdfUrl && (
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-700 hover:underline"
                    >
                      View PDF
                    </a>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 text-gray-600 hover:text-green-700 transition-colors"
                      disabled={deleteLoading}
                    >
                      <Edit2Icon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                      disabled={deleteLoading}
                    >
                      <Trash2Icon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
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

      {/* Render the appropriate modal */}
      {renderModal()}
    </div>
  );
} 