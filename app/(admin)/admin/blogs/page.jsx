'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '../AuthProvider';
import { ref, deleteObject } from 'firebase/storage';
// import BlogList from '@/components/admin/blogs/BlogList'; // Future component
import AddBlogModal from '@/components/admin/blogs/AddBlogModal';
import EditBlogModal from '@/components/admin/blogs/EditBlogModal';
import DeleteConfirmationModal from '@/components/admin/blogs/DeleteConfirmationModal';

const AdminBlogsPage = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false); // State for Add Blog Modal
  const [editingBlog, setEditingBlog] = useState(null); // State for Edit Blog Modal
  const [deletingBlog, setDeletingBlog] = useState(null); // State for Delete Confirmation Modal
  const [deleteLoading, setDeleteLoading] = useState(false); // State for delete operation loading

  // Placeholder states for filtering and sorting (functionality to be added later)
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(['All']); // Placeholder for blog categories

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Define items per page (e.g., 9 or 12 for a grid layout)

  useEffect(() => {
    fetchBlogs();
    // Placeholder: Fetch categories here if needed for filtering
    // fetchBlogCategories(); 
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const blogsRef = collection(db, 'blogs');
      // Assuming a 'createdAt' field for sorting
      const q = query(blogsRef, orderBy('createdAt', 'desc')); 
      const querySnapshot = await getDocs(q);
      
      const blogsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to Date object
        createdAt: doc.data().createdAt?.toDate(),
        publishDate: doc.data().publishDate?.toDate()
      }));
      
      setBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  
  const handleAddBlogClick = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleBlogAdded = () => {
    fetchBlogs(); // Refresh blogs after adding new one
    handleCloseAddModal();
  };

  const handleEditClick = (blog) => {
    setEditingBlog(blog);
  };

  const handleCloseEditModal = () => {
    setEditingBlog(null);
  };

   const handleBlogUpdated = () => {
    fetchBlogs(); // Refresh blogs after updating
    handleCloseEditModal();
  };

  const handleDeleteClick = (blog) => {
    setDeletingBlog(blog);
  };

  const handleCloseDeleteModal = () => {
    setDeletingBlog(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBlog) return;

    setDeleteLoading(true);
    try {
      // Delete cover image from Firebase Storage if it exists
      if (deletingBlog.image) {
        try {
          const imageRef = ref(storage, deletingBlog.image);
          await deleteObject(imageRef);
          console.log('Cover image deleted successfully from storage:', deletingBlog.image);
        } catch (storageError) {
          console.error('Error deleting cover image from storage:', deletingBlog.image, storageError);
          // Continue with deleting the document even if image deletion fails
        }
      }

      // Then delete the blog document from Firestore
      const blogRef = doc(db, 'blogs', deletingBlog.id);
      await deleteDoc(blogRef);
      
      fetchBlogs(); // Refresh blogs after deletion
      setDeletingBlog(null);
    } catch (error) {
      console.error('Error deleting blog:', error);
      setError('Failed to delete blog. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Apply pagination to the blogs array after filtering (if filtering is added later)
  const currentBlogs = blogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter blogs based on search query, category, and date range
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    
    // Date filtering - handle both Date objects and Firestore Timestamps
    const blogDate = blog.publishDate || blog.createdAt;
    const matchesDateRange = (!fromDate || !toDate) || (
      blogDate >= new Date(fromDate) && 
      blogDate <= new Date(toDate + 'T23:59:59')
    );

    return matchesSearch && matchesCategory && matchesDateRange;
  });

  // Sort blogs by publish date (newest first)
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    const dateA = a.publishDate || a.createdAt;
    const dateB = b.publishDate || b.createdAt;
    return dateB - dateA;
  });

  // Authentication check
  if (!user) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Please log in to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="w-[100%] mx-auto ">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-700">Manage your Blog Section</h2>
        <button
          className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
          onClick={handleAddBlogClick}
        >
          Add New Blog
        </button>
      </div>

      {/* Filter, Sort, and Search Controls */}
      <div className="flex items-center space-x-4 mb-6">
        <span className="text-gray-700 font-semibold">Sort by Date:</span>
        {/* Category Filter */}
        <div
          className="border border-gray-200 shadow-md px-4 outline-none rounded-xl py-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
        All Blog
        </div>
        
        {/* Date Filters */}
        <div className="flex items-center space-x-2">
          <input 
            type="date" 
            className="border border-gray-200 shadow-md px-4 outline-none rounded-xl py-2" 
            value={fromDate} 
            onChange={(e) => setFromDate(e.target.value)} 
            placeholder="From Date"
          />
          <span className="text-gray-500">to</span>
          <input 
            type="date" 
            className="border border-gray-200 shadow-md px-4 outline-none rounded-xl py-2" 
            value={toDate} 
            onChange={(e) => setToDate(e.target.value)} 
            placeholder="To Date"
          />
        </div>

        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          No blog found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBlogs.map(blog => (
            <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
               <div className="relative h-48 bg-gray-100">
                 {blog.image ? (
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                 ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">No Image</div>
                 )}
               </div>
               <div className="p-4">
                 <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">{blog.title}</h3>
                 <p className="text-gray-700 text-sm mb-1">By: {blog.postedBy}</p>
                 <p className="text-xs text-gray-500 mb-4">
                   Published: {(blog.publishDate || blog.createdAt).toLocaleDateString()}
                 </p>
                 <div className="flex space-x-4">
                   <button className="text-green-700 hover:text-green-800 transition-colors" onClick={() => handleEditClick(blog)}>Edit</button>
                   <button className="text-red-600 hover:text-red-800 transition-colors" onClick={() => handleDeleteClick(blog)}>Delete</button>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {blogs.length > itemsPerPage && ( // Only show pagination if there are more items than itemsPerPage
        <div className="flex items-center justify-center space-x-2 mt-8">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {showAddModal && (
        <AddBlogModal
          onClose={handleCloseAddModal}
          onBlogAdded={handleBlogAdded}
        />
      )}

       {editingBlog && (
        <EditBlogModal
          blog={editingBlog}
          onClose={handleCloseEditModal}
          onBlogUpdated={handleBlogUpdated}
        />
      )}

      {deletingBlog && (
        <DeleteConfirmationModal
          blog={deletingBlog}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
        />
      )}

    </div>
  );
};

export default AdminBlogsPage; 