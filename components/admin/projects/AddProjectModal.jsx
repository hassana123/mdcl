'use client';

import React, { useState, useEffect } from 'react';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '@/app/(admin)/admin/AuthProvider';

const AddProjectModal = ({ onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    excerpt: '',
  });
  const [sections, setSections] = useState([{ 
    title: '', 
    description: ''
  }]);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = collection(db, 'categories');
        const querySnapshot = await getDocs(categoriesRef);
        const categoriesList = querySnapshot.docs.map(doc => doc.data().name);
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleAddSection = () => {
    setSections([...sections, { 
      title: '', 
      description: ''
    }]);
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = sections.map((section, i) => {
      if (i === index) {
        return { ...section, [field]: value };
      }
      return section;
    });
    setSections(newSections);
  };

  const handleRemoveSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return [];
    
    const uploadedUrls = [];
    const totalFiles = files.length;
    let completedFiles = 0;

    for (const file of files) {
      try {
        const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(downloadURL);
        
        completedFiles++;
        setUploadProgress((completedFiles / totalFiles) * 100);
      } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload files');
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.category || !formData.title || !formData.excerpt) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate sections
    const hasEmptyDescription = sections.some(section => !section.description.trim());
    if (hasEmptyDescription) {
      setError('Please fill in all section descriptions');
      return;
    }

    if (!user) {
      setError('You must be logged in to add a project');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload files first
      const imageUrls = await uploadFiles();

      // Clean up sections data
      const cleanedSections = sections.map(section => {
        const cleanedSection = {
          description: section.description.trim()
        };

        // Only add title if it's not empty
        if (section.title && section.title.trim() !== '') {
          cleanedSection.title = section.title.trim();
        }

        return cleanedSection;
      });

      // Prepare project data
      const projectData = {
        ...formData,
        sections: cleanedSections,
        images: imageUrls,
        createdAt: new Date(),
        createdBy: user.uid,
        status: 'active'
      };

      // Save to Firestore
      await addDoc(collection(db, 'projects'), projectData);
      
      // Close modal and reset form
      onClose();
    } catch (error) {
      console.error('Error adding project:', error);
      setError(error.message || 'Failed to add project');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700/30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Add New Project</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Uploading files... {Math.round(uploadProgress)}%</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter project title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (brief summary)</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Enter a brief summary"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            ></textarea>
          </div>

          {/* Project Details Sections */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Details</label>
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border border-gray-200 rounded-md p-4 mb-4 space-y-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-700">Section {sectionIndex + 1}</h4>
                  {sections.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSection(sectionIndex)} 
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={loading}
                    >
                      Remove Section
                    </button>
                  )}
                </div>

                {/* Optional Section Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter section title (optional)"
                    value={section.title}
                    onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={loading}
                  />
                </div>

                {/* Section Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                  <textarea
                    placeholder="Enter section description"
                    rows="3"
                    value={section.description}
                    onChange={(e) => handleSectionChange(sectionIndex, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    disabled={loading}
                  ></textarea>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSection}
              className="flex items-center text-green-700 hover:text-green-800 transition-colors text-sm"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Add Section
            </button>
          </div>

          {/* Upload Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              disabled={loading}
            />
            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected files: {files.length}</p>
                <ul className="mt-1 text-sm text-gray-500">
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-800 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal; 