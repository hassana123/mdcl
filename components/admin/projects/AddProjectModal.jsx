'use client';

import React, { useState } from 'react';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '@/app/(admin)/admin/AuthProvider';

const AddProjectModal = ({ onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Predefined categories
  const categories = [
    { id: '1', name: 'Research', description: 'Research related projects' },
    { id: '2', name: 'Project Management', description: 'Project management related projects' },
    { id: '3', name: 'Capacity Development', description: 'Capacity development related projects' }
  ];

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    excerpt: '',
  });
  const [sections, setSections] = useState([{ 
    title: '', 
    description: '',
    type: 'text', // 'text', 'bullet', 'numbered', 'nested'
    items: [] // For bullet points and numbered lists
  }]);
  const [coverImage, setCoverImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAddSection = () => {
    setSections([...sections, { 
      title: '', 
      description: '',
      type: 'text',
      items: []
    }]);
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = sections.map((section, i) => {
      if (i === index) {
        if (field === 'type') {
          // Reset items when changing type
          return { ...section, type: value, items: [] };
        }
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
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddListItem = (sectionIndex) => {
    const newSections = sections.map((section, i) => {
      if (i === sectionIndex) {
        return {
          ...section,
          items: [...(section.items || []), { 
            text: '', 
            description: '',
            isBold: false,
            position: 'below',
            subItems: [] 
          }]
        };
      }
      return section;
    });
    setSections(newSections);
  };

  const handleListItemChange = (sectionIndex, itemIndex, field, value) => {
    const newSections = sections.map((section, i) => {
      if (i === sectionIndex) {
        const newItems = [...section.items];
        newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
        return { ...section, items: newItems };
      }
      return section;
    });
    setSections(newSections);
  };

  const handleAddSubItem = (sectionIndex, itemIndex) => {
    const newSections = sections.map((section, i) => {
      if (i === sectionIndex) {
        const newItems = [...section.items];
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          subItems: [...(newItems[itemIndex].subItems || []), '']
        };
        return { ...section, items: newItems };
      }
      return section;
    });
    setSections(newSections);
  };

  const handleSubItemChange = (sectionIndex, itemIndex, subItemIndex, value) => {
    const newSections = sections.map((section, i) => {
      if (i === sectionIndex) {
        const newItems = [...section.items];
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          subItems: newItems[itemIndex].subItems.map((subItem, j) => 
            j === subItemIndex ? value : subItem
          )
        };
        return { ...section, items: newItems };
      }
      return section;
    });
    setSections(newSections);
  };

  const uploadCoverImage = async (formData) => {
    if (!coverImage) return null;

    const { category, title } = formData;
    if (!category || !title) {
      console.error("Category or Title is missing. Cannot upload cover image.");
      return null;
    }

    try {
      // Create a sanitized project folder name
      const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const projectFolder = `${category}/${sanitizedTitle}`;

      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const sanitizedFilename = coverImage.name.toLowerCase().replace(/[^a-z0-9.]/g, '-');
      const storagePath = `projects/${projectFolder}/cover-${timestamp}-${sanitizedFilename}`;
      
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, coverImage);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading cover image:', error);
      throw new Error('Failed to upload cover image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.category || !formData.title || !formData.excerpt) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate sections
    const hasEmptyDescription = sections.some(section => {
      // For text type, description is required
      if (section.type === 'text' && !section.description.trim()) {
        return true;
      }
      // For list types, description is optional
      if (['bullet', 'numbered', 'nested'].includes(section.type)) {
        return false;
      }
      return false;
    });

    if (hasEmptyDescription) {
      setError('Please fill in all text section descriptions');
      return;
    }

    if (!user) {
      setError('You must be logged in to add a project');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload cover image first
      const coverImageUrl = await uploadCoverImage(formData);

      // Clean up sections data
      const cleanedSections = sections.map(section => {
        const cleanedSection = {
          type: section.type,
          items: section.items || []
        };

        // Only add description if it's not empty
        if (section.description && section.description.trim() !== '') {
          cleanedSection.description = section.description.trim();
        }

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
        coverImage: coverImageUrl,
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
              className="capitalize w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
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

                {/* Section Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter section title"
                    value={section.title}
                    onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={loading}
                  />
                </div>

                {/* Section Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Type
                  </label>
                  <select
                    value={section.type}
                    onChange={(e) => handleSectionChange(sectionIndex, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={loading}
                  >
                    <option value="text">Plain Text</option>
                    <option value="bullet">Bullet Points</option>
                    <option value="numbered">Numbered List</option>
                    <option value="nested">Nested List</option>
                  </select>
                </div>

                {/* Content based on type */}
                {section.type === 'text' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">List Items</label>
                      <button
                        type="button"
                        onClick={() => handleAddListItem(sectionIndex)}
                        className="text-green-700 hover:text-green-800 text-sm flex items-center"
                        disabled={loading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        Add Item
                      </button>
                    </div>
                    
                    {section.items?.map((item, itemIndex) => (
                      <div key={itemIndex} className="space-y-2 border border-gray-200 rounded-md p-4 bg-white">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder={`Enter ${section.type === 'numbered' ? 'item' : 'bullet point'}`}
                                value={item.text}
                                onChange={(e) => handleListItemChange(sectionIndex, itemIndex, 'text', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={loading}
                              />
                              <label className="flex items-center gap-1 text-sm text-gray-600">
                                <input
                                  type="checkbox"
                                  checked={item.isBold}
                                  onChange={(e) => handleListItemChange(sectionIndex, itemIndex, 'isBold', e.target.checked)}
                                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                  disabled={loading}
                                />
                                Bold
                              </label>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <select
                                value={item.position}
                                onChange={(e) => handleListItemChange(sectionIndex, itemIndex, 'position', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={loading}
                              >
                                <option value="below">Description Below</option>
                                <option value="inline">Description Inline</option>
                              </select>
                            </div>

                            {item.position === 'below' ? (
                              <textarea
                                placeholder="Enter description (optional)"
                                value={item.description}
                                onChange={(e) => handleListItemChange(sectionIndex, itemIndex, 'description', e.target.value)}
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={loading}
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">-</span>
                                <input
                                  type="text"
                                  placeholder="Enter description (optional)"
                                  value={item.description}
                                  onChange={(e) => handleListItemChange(sectionIndex, itemIndex, 'description', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                  disabled={loading}
                                />
                              </div>
                            )}
                          </div>

                          {section.type === 'nested' && (
                            <button
                              type="button"
                              onClick={() => handleAddSubItem(sectionIndex, itemIndex)}
                              className="text-green-700 hover:text-green-800 p-2"
                              disabled={loading}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                        
                        {/* Sub-items for nested lists */}
                        {section.type === 'nested' && item.subItems?.map((subItem, subItemIndex) => (
                          <div key={subItemIndex} className="ml-6">
                            <input
                              type="text"
                              placeholder="Enter sub-item"
                              value={subItem}
                              onChange={(e) => handleSubItemChange(sectionIndex, itemIndex, subItemIndex, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              disabled={loading}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
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

          {/* Upload Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              disabled={loading}
            />
            {coverImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected file: {coverImage.name}</p>
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