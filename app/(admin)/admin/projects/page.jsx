"use client"
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '../AuthProvider';
import ProjectList from '@/components/admin/projects/ProjectList';
import AddProjectModal from '@/components/admin/projects/AddProjectModal';
import AddCategoryModal from '@/components/admin/projects/AddCategoryModal';

const AdminProjectsPage = () => {
  const { user } = useAuth();
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 6;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      
      setAllProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on category and search query
  const filteredProjects = allProjects.filter(project => {
    if (!project.category) return false;

    // Category filter
    const matchesCategory = selectedCategory === 'All' || 
      project.category.toLowerCase() === selectedCategory.toLowerCase();

    // Search filter
    const matchesSearch = searchQuery === '' || 
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Paginate the filtered results
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const handleAddProjectClick = () => {
    setIsProjectModalOpen(true);
  };

  const handleAddCategoryClick = () => {
    setIsCategoryModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
    fetchProjects();
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };

  const handleCategoryAdded = () => {
    setIsCategoryModalOpen(false);
  };

  const handleProjectDeleted = () => {
    fetchProjects();
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    <div className="w-[100%] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-700">Manage your Projects</h2>

        <div className="space-x-4">
          <button
            className="bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors"
            onClick={handleAddProjectClick}
          >
            Add New Project
          </button>
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
      ) : (
        <ProjectList 
          projects={currentProjects} 
          onProjectDeleted={handleProjectDeleted}
          allProjects={allProjects}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      {filteredProjects.length > itemsPerPage && (
        <div className="flex items-center justify-end space-x-2 mt-8">
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

      {isProjectModalOpen && <AddProjectModal onClose={handleCloseProjectModal} />}
      {isCategoryModalOpen && (
        <AddCategoryModal 
          isOpen={isCategoryModalOpen}
          onClose={handleCloseCategoryModal}
          onCategoryAdded={handleCategoryAdded}
        />
      )}
    </div>
  );
};

export default AdminProjectsPage; 