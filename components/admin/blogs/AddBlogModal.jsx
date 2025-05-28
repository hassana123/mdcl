'use client';

import React, { useState, useEffect } from 'react';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '@/app/(admin)/admin/AuthProvider';

const AddBlogModal = ({ onClose, onBlogAdded }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    // excerpt: '', // Commented out excerpt field
    layoutType: 'standard', // Default layout type
    // Initialize content based on default layout
    content: '', // For 'standard'
    sections: [{ title: '', description: '', id: Math.random() }], // For 'sectioned' and 'introduction-conclusion'
    introduction: '', // For 'introduction-conclusion'
    conclusion: '', // For 'introduction-conclusion'
  });
  const [coverImage, setCoverImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle change for layout type, reset content state accordingly
  const handleLayoutTypeChange = (e) => {
    const newLayoutType = e.target.value;
    setFormData(prev => {
      const newState = {
        ...prev,
        layoutType: newLayoutType,
      };
      // Reset content fields based on the new layout type
      if (newLayoutType === 'standard') {
        newState.sections = [{ title: '', description: '', id: Math.random() }];
        newState.introduction = '';
        newState.conclusion = '';
      } else if (newLayoutType === 'sectioned') {
         newState.content = '';
         newState.introduction = '';
         newState.conclusion = '';
         // Ensure at least one section exists when switching to section-based layouts
         if (prev.sections.length === 0) {
             newState.sections = [{ title: '', description: '', id: Math.random() }];
         }
      } else if (newLayoutType === 'introduction-conclusion') {
         newState.content = '';
         // Ensure at least one section exists when switching to section-based layouts
         if (prev.sections.length === 0) {
             newState.sections = [{ title: '', description: '', id: Math.random() }];
         }
      }
       return newState;
    });
  };


  const handleCoverImageChange = (e) => {
    if (e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  // Section management handlers
  const handleAddSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', description: '', id: Math.random() }],
    }));
  };

  const handleSectionChange = (index, field, value) => {
    setFormData(prev => {
      const newSections = prev.sections.map((section, i) => {
        if (i === index) {
          return { ...section, [field]: value };
        }
        return section;
      });
      return { ...prev, sections: newSections };
    });
  };

  const handleRemoveSection = (index) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const uploadCoverImage = async () => {
    if (!coverImage) return null;

    try {
      const storageRef = ref(storage, `blog_covers/${Date.now()}_${coverImage.name}`);
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

    // Basic validation
    if (!formData.title) {
      setError('Please fill in title');
      return;
    }

    // Cover image validation
    if (!coverImage) {
      setError('Please upload a cover image');
      return;
    }

    // Validate content based on layout type
    if (formData.layoutType === 'standard' && !formData.content.trim()) {
      setError('Please fill in the blog content');
      return;
    }

    if ((formData.layoutType === 'sectioned' || formData.layoutType === 'introduction-conclusion') && 
        formData.sections.some(section => !section.description.trim())) {
        setError('Please fill in all section descriptions');
        return;
    }

    if (formData.layoutType === 'introduction-conclusion' && 
       (!formData.introduction.trim() || !formData.conclusion.trim())) {
       setError('Please fill in both introduction and conclusion');
       return;
    }

    if (!user) {
        setError('You must be logged in to add a blog post');
        return;
    }

    setLoading(true);
    setError('');

    try {
      const coverImageUrl = await uploadCoverImage();

      // Prepare blog data based on layout type
      const blogData = {
        title: formData.title,
        // excerpt: formData.excerpt.trim(), // Commented out excerpt
        layoutType: formData.layoutType,
        image: coverImageUrl, // Can be null
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: user.uid,
      };

      // Add content based on layout type
      if (formData.layoutType === 'standard') {
        blogData.content = formData.content.trim();
      } else if (formData.layoutType === 'sectioned') {
        // Clean up sections: remove empty titles, trim descriptions
        blogData.sections = formData.sections.map(section => ({
            description: section.description.trim(),
            ...(section.title.trim() && { title: section.title.trim() }), // Add title only if not empty
        })).filter(section => section.description); // Filter out sections with empty descriptions

      } else if (formData.layoutType === 'introduction-conclusion') {
        blogData.introduction = formData.introduction.trim();
         // Clean up sections: remove empty titles, trim descriptions
         blogData.sections = formData.sections.map(section => ({
             description: section.description.trim(),
             ...(section.title.trim() && { title: section.title.trim() }), // Add title only if not empty
         })).filter(section => section.description); // Filter out sections with empty descriptions

        blogData.conclusion = formData.conclusion.trim();
      }

      // Add to Firestore
      await addDoc(collection(db, 'blogs'), blogData);

      // Call the callback to refresh the blog list
      if (onBlogAdded) {
        onBlogAdded();
      }
      onClose(); // Close modal on success

    } catch (error) {
      console.error('Error adding blog:', error);
      setError(error.message || 'Failed to add blog post');
    } finally {
      setLoading(false);
      setUploadProgress(0); // Reset progress
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700/30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Add New Blog Post</h2>
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

        {uploadProgress > 0 && uploadProgress <= 100 && ( // Show progress bar during upload
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Uploading cover image... {Math.round(uploadProgress)}%</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter blog title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={loading}
            />
          </div>

          {/* Excerpt - Commented out
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Brief Summary)</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Enter a brief summary of the blog post (max 30 words)"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={loading}
            ></textarea>
          </div>
          */}

          {/* Layout Type Selector */}
          <div>
            <label htmlFor="layoutType" className="block text-sm font-medium text-gray-700 mb-1">Blog Layout Type</label>
            <select
              id="layoutType"
              name="layoutType"
              value={formData.layoutType}
              onChange={handleLayoutTypeChange} // Use the new handler
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            >
              <option value="standard">Standard (Simple paragraphs)</option>
              <option value="sectioned">Sectioned (With subheadings)</option>
              <option value="introduction-conclusion">Introduction + Sections + Conclusion</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Choose how you want your blog content to be structured</p>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image <span className="text-red-500">*</span></label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              disabled={loading}
              required
            />
            <p className="text-sm text-gray-500 mt-1">A cover image is required for the blog post</p>
          </div>

          {/* Dynamic Content Sections */}

          {/* Standard Layout Content */}
          {formData.layoutType === 'standard' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blog Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Enter blog content"
                rows="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={loading}
              ></textarea>
            </div>
          )}

          {/* Introduction for introduction-conclusion layout */}
          {formData.layoutType === 'introduction-conclusion' && (
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Introduction</label>
               <textarea
                 name="introduction"
                 value={formData.introduction}
                 onChange={handleInputChange}
                 placeholder="Enter introduction"
                 rows="3"
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                 required
                 disabled={loading}
               ></textarea>
             </div>
          )}


          {/* Sectioned Layout Content (and Intermediate Sections for intro-conclusion) */}
          {(formData.layoutType === 'sectioned' || formData.layoutType === 'introduction-conclusion') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{formData.layoutType === 'sectioned' ? 'Sections' : 'Intermediate Sections'}</label>
              {formData.sections.map((section, index) => (
                <div key={section.id || index} className="border border-gray-200 rounded-md p-4 mb-4 space-y-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                     <h4 className="font-semibold text-gray-700">Section {index + 1}</h4>
                     {formData.sections.length > 1 && (
                       <button 
                         type="button" 
                         onClick={() => handleRemoveSection(index)} 
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
                       onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                       disabled={loading}
                     />
                     <p className="text-sm text-gray-500 mt-1">Leave empty if no title is needed for this section</p>
                   </div>

                  {/* Section Description */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                     <textarea
                       placeholder="Enter section description"
                       rows="3"
                       value={section.description}
                       onChange={(e) => handleSectionChange(index, 'description', e.target.value)}
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
          )}

          {/* Conclusion for introduction-conclusion layout */}
          {formData.layoutType === 'introduction-conclusion' && (
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Conclusion</label>
                  <textarea
                   name="conclusion"
                   value={formData.conclusion}
                   onChange={handleInputChange}
                   placeholder="Enter conclusion"
                   rows="3"
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                   required
                   disabled={loading}
                  ></textarea>
              </div>
          )}

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
              {loading ? 'Saving...' : 'Add Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogModal; 