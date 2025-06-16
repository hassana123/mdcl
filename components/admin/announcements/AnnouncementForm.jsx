"use client";

import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AnnouncementForm = ({ onClose, onAnnouncementAdded, editData = null }) => {
  const [formType, setFormType] = useState('new');
  const [formData, setFormData] = useState({
    title: editData?.title || '',
    content: editData?.content || '',
    priority: editData?.priority || 'normal',
    status: editData?.status || 'active',
    sourceType: editData?.sourceType || '',
    sourceId: editData?.sourceId || '',
    sourceTitle: editData?.sourceTitle || '',
    attachments: editData?.attachments || [],
    coverImage: editData?.coverImage || null,
    link: editData?.link || '',
    category:editData?.category ||'',
  });
  const [availableContent, setAvailableContent] = useState({
    blogs: [],
    newsletters: [],
    projects: []
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('blogs');
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editData?.coverImage || null);

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || '',
        content: editData.content || '',
        priority: editData.priority || 'normal',
        status: editData.status || 'active',
        sourceType: editData.sourceType || '',
        sourceId: editData.sourceId || '',
        sourceTitle: editData.sourceTitle || '',
        attachments: editData.attachments || [],
        coverImage: editData.coverImage || null,
        link: editData.link || '',
        category: editData.category||"",
      });
    }
  }, [editData]);

  useEffect(() => {
    if (formType === 'select') {
      fetchAvailableContent();
    }
  }, [formType]);

  const fetchAvailableContent = async () => {
    try {
      setLoading(true);
      // Fetch blogs
      const blogsSnapshot = await getDocs(collection(db, 'blogs'));
      const blogs = blogsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'blog'
      }));

      // Fetch newsletters from resources collection with category filter
      const newslettersQuery = query(
        collection(db, 'resources'),
        where('category', '==', 'newsletter')
      );
      const newslettersSnapshot = await getDocs(newslettersQuery);
      const newsletters = newslettersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'newsletter'
      }));

      // Fetch projects
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const projects = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'project'
      }));

      setAvailableContent({
        blogs,
        newsletters,
        projects
      });
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentSelect = (content) => {
    let announcementData = {
      title: content.title || '',
      content: '',
      priority: 'normal',
      status: 'active',
      sourceId: content.id,
      sourceType: activeTab.slice(0, -1), // Remove 's' from blogs/newsletters/projects
      sourceTitle: content.title || '',
      attachments: [],
      coverImage: null,
      link: '',
      category: content?.category ||""
    };

    // Set content based on type
    switch (activeTab) {
      case 'blogs': {
        const desc = content.description || '';
        const sectionDesc = content.sections && content.sections[0]?.description ? content.sections[0].description : '';
        let combined = desc;
        if (sectionDesc) combined += (desc ? '\n\n' : '') + sectionDesc;
        announcementData.content = combined.trim() || 'No description available.';
        announcementData.coverImage = content.image || null;
        break;
      }
      case 'newsletters': {
        announcementData.content = (content.description || 'No description available.').trim();
        announcementData.coverImage = content.coverImage || null;
        if (content.pdfUrl) {
          announcementData.attachments = [{
            type: 'pdf',
            url: content.pdfUrl,
            name: `${content.title || 'Newsletter'}.pdf`
          }];
        }
        break;
      }
      case 'projects': {
        const excerpt = content.excerpt || '';
        const sectionDesc = content.sections && content.sections[0]?.description ? content.sections[0].description : '';
        let combined = excerpt;
        if (sectionDesc) combined += (excerpt ? '\n\n' : '') + sectionDesc;
        announcementData.content = combined.trim() || 'No description available.';
        announcementData.coverImage = content.coverImage || null;
        // Store normalized category for routing
        announcementData.category = (content.category)
        // Store original project category as well
        announcementData.projectCategory = content.category || '';
        if (content.sections) {
          announcementData.attachments = content.sections.map((section, index) => ({
            type: 'section',
            title: section.title || `Section ${index + 1}`,
            content: section.description || ''
          }));
        }
        break;
      }
    }

    setFormData(announcementData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const storage = getStorage();
    const storageRef = ref(storage, `announcements/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted', formData);


    setLoading(true);
    setError(null);

    try {
      const announcementData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        priority: formData.priority || 'normal',
        status: formData.status || 'active',
        timestamp: serverTimestamp(),
        sourceType: formData.sourceType || '',
        sourceId: formData.sourceId || '',
        sourceTitle: formData.sourceTitle || '',
        attachments: formData.attachments || [],
        coverImage: formData.coverImage || null,
        link: formData.link || '',
        category:formData?.category || ''
      };
    //   if (!formData.title || !formData.content) {
    //     setError("Please fill in all required fields");
    //     return;
    //   }
  
      console.log('Saving announcement:', announcementData);

      if (editData) {
        const docRef = doc(db, 'announcements', editData.id);
        await updateDoc(docRef, announcementData);
      } else {
        const docRef = await addDoc(collection(db, 'announcements'), announcementData);
        console.log('Announcement created with ID:', docRef.id);
      }

      if (onAnnouncementAdded) {
        onAnnouncementAdded();
      }
      onClose();
    } catch (err) {
      console.error("Error saving announcement:", err);
      setError(err.message || "Failed to save announcement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getContentDescription = (content) => {
    if (content.type === 'project') {
      return content.excerpt || (content.sections?.[0]?.description || 'No description available');
    } else if (content.type === 'blog') {
      return content.sections?.[0]?.description || 'No description available';
    } else if (content.type === 'newsletter') {
      return content.description || 'No description available';
    }
    return 'No description available';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl mx-auto my-8 flex flex-col max-h-[calc(100vh-2rem)]">
        {/* Fixed Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold">{editData ? 'Edit Announcement' : 'New Announcement'}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4">
            <div className="flex gap-4">
              <button
                onClick={() => setFormType('new')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  formType === 'new'
                    ? 'bg-[color:var(--color-primary-light-brown)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Create New
              </button>
              <button
                onClick={() => setFormType('select')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  formType === 'select'
                    ? 'bg-[color:var(--color-primary-light-brown)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Select from Existing
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {formType === 'new' ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link to Content
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image
                </label>
                <div className="mt-1 flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                  >
                    Choose Image
                  </label>
                  {imagePreview && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)]"
                  >
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[color:var(--color-primary-light-brown)] text-white rounded-lg hover:bg-[color:var(--color-primary-olive)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editData ? 'Update Announcement' : 'Create Announcement'}
                </button>
              </div>
            </form>
          ) : (
            <div className="h-full">
              <div className="border-b border-gray-200 px-6 flex-shrink-0">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('blogs')}
                    className={`${
                      activeTab === 'blogs'
                        ? 'border-[color:var(--color-primary-light-brown)] text-[color:var(--color-primary-light-brown)]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                    Blogs
                  </button>
                  <button
                    onClick={() => setActiveTab('newsletters')}
                    className={`${
                      activeTab === 'newsletters'
                        ? 'border-[color:var(--color-primary-light-brown)] text-[color:var(--color-primary-light-brown)]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                    Newsletters
                  </button>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`${
                      activeTab === 'projects'
                        ? 'border-[color:var(--color-primary-light-brown)] text-[color:var(--color-primary-light-brown)]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                    Projects
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading content...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeTab === 'blogs' && (
                      <div className="space-y-2">
                        {availableContent.blogs.map((blog) => (
                          <button
                            key={blog.id}
                            onClick={() => handleContentSelect(blog)}
                            className={`w-full text-left p-4 rounded-lg border transition-colors duration-200 ${
                              formData.sourceId === blog.id
                                ? 'border-[color:var(--color-primary-light-brown)] bg-[color:var(--color-primary-light-brown)]/10'
                                : 'border-gray-200 hover:border-[color:var(--color-primary-light-brown)]'
                            }`}
                          >
                            {blog.image && (
                              <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                                <Image
                                  src={blog.image}
                                  alt={blog.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <h4 className="font-medium text-gray-900">{blog.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {getContentDescription(blog)}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}

                    {activeTab === 'newsletters' && (
                      <div className="space-y-2">
                        {availableContent.newsletters.map((newsletter) => (
                          <button
                            key={newsletter.id}
                            onClick={() => handleContentSelect(newsletter)}
                            className={`w-full text-left p-4 rounded-lg border transition-colors duration-200 ${
                              formData.sourceId === newsletter.id
                                ? 'border-[color:var(--color-primary-light-brown)] bg-[color:var(--color-primary-light-brown)]/10'
                                : 'border-gray-200 hover:border-[color:var(--color-primary-light-brown)]'
                            }`}
                          >
                            {newsletter.coverImage && (
                              <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                                <Image
                                  src={newsletter.coverImage}
                                  alt={newsletter.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <h4 className="font-medium text-gray-900">{newsletter.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {getContentDescription(newsletter)}
                            </p>
                            {newsletter.pdfUrl && (
                              <div className="mt-2">
                                <span className="text-xs text-gray-500">PDF Available</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {activeTab === 'projects' && (
                      <div className="space-y-2">
                        {availableContent.projects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => handleContentSelect(project)}
                            className={`w-full text-left p-4 rounded-lg border transition-colors duration-200 ${
                              formData.sourceId === project.id
                                ? 'border-[color:var(--color-primary-light-brown)] bg-[color:var(--color-primary-light-brown)]/10'
                                : 'border-gray-200 hover:border-[color:var(--color-primary-light-brown)]'
                            }`}
                          >
                            {project.coverImage && (
                              <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                                <Image
                                  src={project.coverImage}
                                  alt={project.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <h4 className="font-medium text-gray-900">{project.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {getContentDescription(project)}
                            </p>
                            {project.sections?.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs text-gray-500">
                                  {project.sections.length} sections available
                                </span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {formData.sourceId && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)]"
                      >
                        <option value="high">High</option>
                        <option value="normal">Normal</option>
                        <option value="low">Low</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)]"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="bg-[color:var(--color-primary-light-brown)] text-white px-4 py-2 rounded-lg hover:bg-[color:var(--color-primary-olive)] transition-colors"
                    >
                      {editData ? 'Update Announcement' : 'Create Announcement'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementForm; 