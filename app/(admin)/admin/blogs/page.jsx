'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '../AuthProvider';
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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(['All']); // Placeholder for blog categories

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
        createdAt: doc.data().createdAt?.toDate() 
      }));
      
      setBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  // Placeholder function for fetching blog categories
  const fetchBlogCategories = async () => {
    try {
      const categoriesRef = collection(db, 'blogCategories'); // Assuming a 'blogCategories' collection
      const querySnapshot = await getDocs(categoriesRef);
      const categoriesList = ['All', ...querySnapshot.docs.map(doc => doc.data().name)];
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error fetching blog categories:', error);      // Fallback or handle error
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

      {/* Filter, Sort, and Search Controls (Placeholder) */}
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
        
        {/* Date Filters (Placeholder) */}
        <input type="date" className="border border-gray-200 shadow-md px-4 outline-none rounded-xl py-2" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" className="border border-gray-200 shadow-md px-4 outline-none rounded-xl py-2" value={toDate} onChange={(e) => setToDate(e.target.value)} />

        {/* Search Input */}
        <div className="relative ml-auto">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pl-10 border border-gray-200 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
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
          {blogs.map(blog => (
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
                 <p className="text-gray-700 text-sm mb-1">By: Admin</p>{/* Assuming admin author for now */}
                 <p className="text-xs text-gray-500 mb-4">{blog.createdAt?.toLocaleDateString()}</p>
                 {/* <p className="text-gray-700 text-sm mb-4 line-clamp-2">{blog.excerpt || 'No excerpt available.'}</p> */}
                 <div className="flex space-x-4">
                   <button className="text-green-700 hover:text-green-800 transition-colors" onClick={() => handleEditClick(blog)}>Edit</button>
                   <button className="text-red-600 hover:text-red-800 transition-colors" onClick={() => handleDeleteClick(blog)}>Delete</button>
                 </div>
               </div>
            </div>
          ))}
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