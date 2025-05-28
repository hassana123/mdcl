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
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

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
      
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProjectClick = () => {
    setIsProjectModalOpen(true);
  };

  const handleAddCategoryClick = () => {
    setIsCategoryModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
    fetchProjects(); // Refresh projects after adding new one
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };

  const handleCategoryAdded = () => {
    // This will be passed to AddCategoryModal to refresh categories
    setIsCategoryModalOpen(false);
  };

  const handleProjectDeleted = () => {
    fetchProjects();
  };

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
          <button 
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            onClick={handleAddCategoryClick}
          >
            Add New Category
          </button>
        </div>
      </div>

      {/* Manage Your Projects section title - seems to be missing in the provided image but present in the general layout */}
    
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
        <ProjectList projects={projects} onProjectDeleted={handleProjectDeleted} />
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