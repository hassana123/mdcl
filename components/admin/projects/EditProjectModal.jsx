'use client';

import React, { useState } from 'react';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/app/(admin)/admin/AuthProvider';

const EditProjectModal = ({ project, onClose }) => {
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
    category: project.category || '',
    title: project.title || '',
    excerpt: project.excerpt || '',
  });
  const [sections, setSections] = useState(project.sections?.map(section => ({
    ...section,
    type: section.type || 'text',
    items: section.items || []
  })) || [{ 
    title: '', 
    description: '',
    type: 'text',
    items: []
  }]);
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(project.images || []);
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

  const handleRemoveExistingImage = async (indexToRemove) => {
    const imageToRemoveUrl = existingImages[indexToRemove];

    try {
      // Extract the path from the URL
      let imagePath;
      try {
        // Handle different URL formats
        if (imageToRemoveUrl.includes('/o/')) {
          // URL format: https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]?[token]
          imagePath = decodeURIComponent(imageToRemoveUrl.split('/o/')[1].split('?')[0]);
        } else {
          // If it's already a path
          imagePath = imageToRemoveUrl;
        }

        // Remove any leading/trailing slashes
        imagePath = imagePath.replace(/^\/+|\/+$/g, '');

        console.log('Attempting to delete image at path:', imagePath);
        const imageRef = ref(storage, imagePath);
        
        try {
          await deleteObject(imageRef);
          console.log('Successfully deleted image:', imagePath);
          // Remove image URL from the state after successful deletion
          setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
        } catch (deleteError) {
          if (deleteError.code === 'storage/object-not-found') {
            console.warn('Image not found in storage, removing from state anyway:', imagePath);
            // Remove from state even if not found in storage
            setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
          } else {
            throw deleteError;
          }
        }
      } catch (pathError) {
        console.error('Error processing image path:', pathError);
        // If we can't process the path, just remove from state
        setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
      }
    } catch (error) {
      console.error('Error in handleRemoveExistingImage:', error);
      setError('Failed to delete image. It will be removed from the project anyway.');
      // Remove from state even if there's an error
      setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
    }
  };

  const uploadFiles = async (formData) => {
    if (files.length === 0) return [];

    const { category, title } = formData;
    if (!category || !title) {
      console.error("Category or Title is missing. Cannot upload new files.");
      return [];
    }

    const uploadedUrls = [];
    const totalFiles = files.length;
    let completedFiles = 0;

    // Create a sanitized project folder name
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const projectFolder = `${category}/${sanitizedTitle}`;

    for (const file of files) {
      try {
        // Create a unique filename with timestamp
        const timestamp = Date.now();
        const sanitizedFilename = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-');
        const storagePath = `projects/${projectFolder}/${timestamp}-${sanitizedFilename}`;
        
        const storageRef = ref(storage, storagePath);
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
      setError('You must be logged in to edit a project');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload new files first
      const newImageUrls = await uploadFiles(formData);

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
        images: [...existingImages, ...newImageUrls],
        updatedAt: new Date(),
        updatedBy: user.uid
      };

      // Update in Firestore
      const projectRef = doc(db, 'projects', project.id);
      await updateDoc(projectRef, projectData);
      
      // Close modal and reset form
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
      setError(error.message || 'Failed to update project');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700/30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Project</h2>
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

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Existing Images</label>
              <div className="grid grid-cols-3 gap-4">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image} 
                      alt={`Project image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Images</label>
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal; 