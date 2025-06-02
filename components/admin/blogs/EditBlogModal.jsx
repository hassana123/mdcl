'use client';

import React, { useState, useEffect } from 'react';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { useAuth } from '@/app/(admin)/admin/AuthProvider';

const EditBlogModal = ({ blog, onClose, onBlogUpdated }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: blog.title || '',
    // excerpt: blog.excerpt || '', // Commented out excerpt
    layoutType: blog.layoutType || 'standard',
    // Initialize content based on existing blog data and layout type
    content: blog.layoutType === 'standard' ? blog.content || '' : '',
    sections: (blog.layoutType === 'sectioned' || blog.layoutType === 'introduction-conclusion') ? 
      blog.sections?.map(section => ({
        ...section,
        type: section.type || 'text',
        items: section.items || []
      })) || [{ 
        title: '', 
        description: '',
        type: 'text',
        items: []
      }] : [{ 
        title: '', 
        description: '',
        type: 'text',
        items: []
      }],
    introduction: blog.layoutType === 'introduction-conclusion' ? blog.introduction || '' : '',
    conclusion: blog.layoutType === 'introduction-conclusion' ? blog.conclusion || '' : '',
    publishDate: blog.publishDate ? (typeof blog.publishDate.toDate === 'function' ? 
      blog.publishDate.toDate().toISOString().split('T')[0] : 
      new Date(blog.publishDate).toISOString().split('T')[0]) : 
      new Date().toISOString().split('T')[0],
    postedBy: blog.postedBy || 'mdcl',
  });
  const [coverImageFile, setCoverImageFile] = useState(null); // For new file uploads
  const [existingCoverImageUrl, setExistingCoverImageUrl] = useState(blog.image || null); // To display and manage existing image
  const [uploadProgress, setUploadProgress] = useState(0);
  const [blogCategories, setBlogCategories] = useState([]); // State for blog categories (if needed)

  // Optional: Fetch blog categories on modal open
  useEffect(() => {
    const fetchBlogCategories = async () => {
      try {
        const categoriesRef = collection(db, 'blogCategories');
        const querySnapshot = await getDocs(categoriesRef);
        const categoriesList = querySnapshot.docs.map(doc => doc.data().name);
        setBlogCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching blog categories:', error);
        // Handle error or set default categories if needed
      }
    };
    // fetchBlogCategories(); // Uncomment if you have blog categories
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLayoutTypeChange = (e) => {
    const newLayoutType = e.target.value;
    setFormData(prev => {
      const newState = {
        ...prev,
        layoutType: newLayoutType,
      };
      // Reset content fields based on the new layout type, preserving existing data if possible
      if (newLayoutType === 'standard') {
         // If switching FROM a section-based layout, try to combine sections into content
         if (prev.layoutType !== 'standard' && (prev.sections?.length > 0 || prev.introduction || prev.conclusion)){
             let combinedContent = '';
             if(prev.introduction) combinedContent += prev.introduction + '\n\n';
             if(prev.sections?.length > 0) {
                 prev.sections.forEach(section => {
                     if(section.title) combinedContent += `## ${section.title}\n`; // Basic markdown title
                     if(section.description) combinedContent += section.description + '\n\n';
                 });
             }
             if(prev.conclusion) combinedContent += prev.conclusion + '\n\n';
             newState.content = combinedContent.trim();
         } else {
             newState.content = prev.content || ''; // Keep existing standard content
         }
         newState.sections = [{ title: '', description: '', id: Math.random() }];
         newState.introduction = '';
         newState.conclusion = '';
      } else if (newLayoutType === 'sectioned') {
         // If switching FROM standard, try to create a basic section from content
         if(prev.layoutType === 'standard' && prev.content?.trim()){
              newState.sections = [{ title: '', description: prev.content.trim(), id: Math.random() }];
         } else {
              newState.sections = prev.sections?.length > 0 ? prev.sections : [{ title: '', description: '', id: Math.random()}]; // Keep existing sections or start fresh
         }
         newState.content = '';
         newState.introduction = '';
         newState.conclusion = '';
      } else if (newLayoutType === 'introduction-conclusion') {
         // If switching FROM standard, try to create intro/section/conclusion from content
          if(prev.layoutType === 'standard' && prev.content?.trim()){
               // Simple split: first paragraph intro, rest as one section, last paragraph conclusion
               const paragraphs = prev.content.split('\n\n').filter(p => p.trim());
               newState.introduction = paragraphs[0] || '';
               newState.sections = [{ title: '', description: paragraphs.slice(1, -1).join('\n\n'), id: Math.random() }];
               newState.conclusion = paragraphs[paragraphs.length - 1] || '';
          } else {
               newState.introduction = prev.introduction || '';
               newState.sections = prev.sections?.length > 0 ? prev.sections : [{ title: '', description: '', id: Math.random()}];
               newState.conclusion = prev.conclusion || '';
          }
         newState.content = '';
      }
       return newState;
    });
  };

  const handleCoverImageFileChange = (e) => {
    if (e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
       setError(''); // Clear any previous error
    }
  };

  const handleRemoveExistingImage = async () => {
    if (existingCoverImageUrl) {
      try {
        // Remove file from Firebase Storage
        const imageRef = ref(storage, existingCoverImageUrl);
        await deleteObject(imageRef);
        console.log('Existing cover image deleted successfully from storage:', existingCoverImageUrl);

      } catch (error) {
        console.error('Error deleting existing cover image from storage:', error);
        setError('Failed to delete old cover image from storage.'); // Optional: inform user
      }
    }

    // Always update state to remove the image preview, even if storage deletion fails
    setExistingCoverImageUrl(null);
    setCoverImageFile(null); // Also clear any pending new file upload
    setError(''); // Clear any previous error
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

  const handleAddListItem = (sectionIndex) => {
    setFormData(prev => {
      const newSections = prev.sections.map((section, i) => {
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
      return { ...prev, sections: newSections };
    });
  };

  const handleListItemChange = (sectionIndex, itemIndex, field, value) => {
    setFormData(prev => {
      const newSections = prev.sections.map((section, i) => {
        if (i === sectionIndex) {
          const newItems = [...section.items];
          newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
          return { ...section, items: newItems };
        }
        return section;
      });
      return { ...prev, sections: newSections };
    });
  };

  const handleAddSubItem = (sectionIndex, itemIndex) => {
    setFormData(prev => {
      const newSections = prev.sections.map((section, i) => {
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
      return { ...prev, sections: newSections };
    });
  };

  const handleSubItemChange = (sectionIndex, itemIndex, subItemIndex, value) => {
    setFormData(prev => {
      const newSections = prev.sections.map((section, i) => {
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
      return { ...prev, sections: newSections };
    });
  };

  const uploadCoverImage = async () => {
    if (coverImageFile) {
       try {
         const storageRef = ref(storage, `blog_covers/${Date.now()}_${coverImageFile.name}`);
         const snapshot = await uploadBytes(storageRef, coverImageFile);
         const downloadURL = await getDownloadURL(snapshot.ref);

         // If there was an existing image, delete it after the new one is uploaded
         if (existingCoverImageUrl) {
           try {
             const oldImageRef = ref(storage, existingCoverImageUrl);
             await deleteObject(oldImageRef);
             console.log('Old cover image deleted successfully from storage:', existingCoverImageUrl);
           } catch (deleteError) {
             console.error('Error deleting old cover image from storage:', existingCoverImageUrl, deleteError);
             // Continue even if deletion fails, new image is already uploaded
           }
         }

         return downloadURL;
       } catch (error) {
         console.error('Error uploading cover image:', error);
         throw new Error('Failed to upload new cover image');
       }
    } else if (existingCoverImageUrl === null) {
       // If existing image was removed and no new file selected, return null
       return null;
    } else {
       // If no new file selected and existing image remains, return existing URL
       return existingCoverImageUrl;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title) {
      setError('Please fill in title');
      return;
    }

    // Validate content based on layout type
    if (formData.layoutType === 'standard' && !formData.content.trim()) {
      setError('Please fill in the blog content');
      return;
    }

    if ((formData.layoutType === 'sectioned' || formData.layoutType === 'introduction-conclusion') && 
        formData.sections.some(section => {
          // For text type, description is required
          if (section.type === 'text' && !section.description.trim()) {
            return true;
          }
          // For list types, description is optional
          if (['bullet', 'numbered', 'nested'].includes(section.type)) {
            return false;
          }
          return false;
        })) {
      setError('Please fill in all text section descriptions');
      return;
    }

    if (formData.layoutType === 'introduction-conclusion' && 
       (!formData.introduction.trim() || !formData.conclusion.trim())) {
       setError('Please fill in both introduction and conclusion');
       return;
    }

    if (!user) {
        setError('You must be logged in to update a blog post');
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
        publishDate: new Date(formData.publishDate),
        updatedAt: new Date(),
        updatedBy: user.uid,
        postedBy: formData.postedBy,
      };

      // Add content based on layout type
      if (formData.layoutType === 'standard') {
        blogData.content = formData.content.trim();
      } else if (formData.layoutType === 'sectioned') {
        // Clean up sections: remove empty titles, trim descriptions
        blogData.sections = formData.sections.map(section => ({
          type: section.type || 'text',
          items: section.items || [],
          ...(section.title && section.title.trim() && { title: section.title.trim() }), // Add title only if not empty
          ...(section.description && section.description.trim() && { description: section.description.trim() }), // Add description only if not empty
        })).filter(section => 
          (section.description && section.description.trim()) || (section.items && section.items.length > 0)
        ); // Filter out empty sections

      } else if (formData.layoutType === 'introduction-conclusion') {
        blogData.introduction = formData.introduction.trim();
        // Clean up sections: remove empty titles, trim descriptions
        blogData.sections = formData.sections.map(section => ({
          type: section.type || 'text',
          items: section.items || [],
          ...(section.title && section.title.trim() && { title: section.title.trim() }), // Add title only if not empty
          ...(section.description && section.description.trim() && { description: section.description.trim() }), // Add description only if not empty
        })).filter(section => 
          (section.description && section.description.trim()) || (section.items && section.items.length > 0)
        ); // Filter out empty sections
        blogData.conclusion = formData.conclusion.trim();
      }

      // Update in Firestore
      const blogRef = doc(db, 'blogs', blog.id);
      await updateDoc(blogRef, blogData);

      // Call the callback to refresh the blog list
      if (onBlogUpdated) {
        onBlogUpdated();
      }
      onClose(); // Close modal on success

    } catch (error) {
      console.error('Error updating blog:', error);
      setError(error.message || 'Failed to update blog post');
    } finally {
      setLoading(false);
      setUploadProgress(0); // Reset progress
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700/30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Blog Post</h2>
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

          {/* Publish Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
            <input
              type="date"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={loading}
            />
          </div>

          {/* Posted By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Posted By</label>
            <input
              type="text"
              name="postedBy"
              value={formData.postedBy}
              onChange={handleInputChange}
              placeholder="Enter author name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={loading}
            />
          </div>

          {/* Layout Type Selector */}
          <div>
            <label htmlFor="layoutType" className="block text-sm font-medium text-gray-700 mb-1">Blog Layout Type</label>
            <select
              id="layoutType"
              name="layoutType"
              value={formData.layoutType}
              onChange={handleLayoutTypeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            >
              <option value="standard">Standard (Simple paragraphs)</option>
              <option value="sectioned">Sectioned (With subheadings)</option>
              <option value="introduction-conclusion">Introduction + Sections + Conclusion</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Choose how you want your blog content to be structured</p>
          </div>

          {/* Cover Image Upload and Existing Image Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
            {existingCoverImageUrl && !coverImageFile && (
               <div className="mb-4 relative w-32 h-24 rounded-md overflow-hidden">
                 <img src={existingCoverImageUrl} alt="Existing Cover" className="w-full h-full object-cover" />
                 <button
                    type="button"
                    onClick={handleRemoveExistingImage}
                    className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full text-xs"
                    disabled={loading}
                 >
                    X
                 </button>
               </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              disabled={loading}
            />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Blog Sections</label>
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

                  {/* Section Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter section title"
                      value={section.title}
                      onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
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
                      onChange={(e) => handleSectionChange(index, 'type', e.target.value)}
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
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">List Items</label>
                        <button
                          type="button"
                          onClick={() => handleAddListItem(index)}
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
                                  onChange={(e) => handleListItemChange(index, itemIndex, 'text', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                  disabled={loading}
                                />
                                <label className="flex items-center gap-1 text-sm text-gray-600">
                                  <input
                                    type="checkbox"
                                    checked={item.isBold}
                                    onChange={(e) => handleListItemChange(index, itemIndex, 'isBold', e.target.checked)}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    disabled={loading}
                                  />
                                  Bold
                                </label>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <select
                                  value={item.position}
                                  onChange={(e) => handleListItemChange(index, itemIndex, 'position', e.target.value)}
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
                                  onChange={(e) => handleListItemChange(index, itemIndex, 'description', e.target.value)}
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
                                    onChange={(e) => handleListItemChange(index, itemIndex, 'description', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    disabled={loading}
                                  />
                                </div>
                              )}
                            </div>

                            {section.type === 'nested' && (
                              <button
                                type="button"
                                onClick={() => handleAddSubItem(index, itemIndex)}
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
                                onChange={(e) => handleSubItemChange(index, itemIndex, subItemIndex, e.target.value)}
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogModal; 