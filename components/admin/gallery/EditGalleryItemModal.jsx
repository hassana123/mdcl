"use client";
import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { PlusIcon, XIcon } from 'lucide-react';
import Image from 'next/image';

const EditGalleryItemModal = ({ isOpen, onClose, onGalleryItemUpdated, item }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState('image');
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setDescription(item.description || '');
      setExistingImages(item.images || []);
      setExistingVideos(item.videos || []);
    }
  }, [item]);

  const handleFileChange = (e, fileType) => {
    const newFiles = Array.from(e.target.files);
    if (fileType === 'image') {
      setImageFiles(prevFiles => [...prevFiles, ...newFiles]);
    } else if (fileType === 'video') {
      setVideoFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
    e.target.value = null;
  };

  const handleRemoveFile = (fileName, fileType) => {
    if (fileType === 'image') {
      setImageFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    } else if (fileType === 'video') {
      setVideoFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    }
    setUploadProgress(prevProgress => {
      const newProgress = { ...prevProgress };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  const handleRemoveExistingFile = async (fileUrl, fileType) => {
    try {
      // Delete from storage
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);

      // Update state
      if (fileType === 'image') {
        setExistingImages(prev => prev.filter(url => url !== fileUrl));
      } else if (fileType === 'video') {
        setExistingVideos(prev => prev.filter(url => url !== fileUrl));
      }
    } catch (error) {
      console.error('Error removing file:', error);
      setError('Failed to remove file. Please try again.');
    }
  };

  const handleUpdate = async () => {
    if (!title) {
      setError("Please provide a title.");
      return;
    }

    setLoading(true);
    setError(null);
    const newImageUrls = [];
    const newVideoUrls = [];

    try {
      // Upload new files
      const uploadPromises = [...imageFiles, ...videoFiles].map(file => {
        return new Promise((resolve, reject) => {
          const isImage = file.type.startsWith('image/');
          const isVideo = file.type.startsWith('video/');
          const storagePath = `gallery/${title}/${isImage ? 'images' : 'videos'}/${file.name}`;
          const storageRef = ref(storage, storagePath);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
            },
            (error) => {
              console.error("Upload error:", error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                if (isImage) {
                  newImageUrls.push(downloadURL);
                } else if (isVideo) {
                  newVideoUrls.push(downloadURL);
                }
                resolve();
              }).catch(reject);
            }
          );
        });
      });

      await Promise.all(uploadPromises);

      // Update Firestore document
      const galleryRef = doc(db, 'gallery', item.id);
      await updateDoc(galleryRef, {
        title,
        description,
        images: [...existingImages, ...newImageUrls],
        videos: [...existingVideos, ...newVideoUrls],
      });

      onGalleryItemUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating gallery item:", err);
      setError("Failed to update gallery item.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Gallery Item</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Existing Images</label>
              <div className="grid grid-cols-2 gap-2">
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-1 aspect-h-1">
                      <Image
                        src={imageUrl}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveExistingFile(imageUrl, 'image')}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Existing Videos */}
          {existingVideos.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Existing Videos</label>
              <div className="space-y-2">
                {existingVideos.map((videoUrl, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm truncate">Video {index + 1}</span>
                    <button
                      onClick={() => handleRemoveExistingFile(videoUrl, 'video')}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add New Files</label>
            <select
              value={selectedFileType}
              onChange={(e) => setSelectedFileType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>
          </div>

          {selectedFileType === 'image' && (
            <div>
              <div className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  onChange={(e) => handleFileChange(e, 'image')}
                  className="sr-only"
                  accept="image/*"
                />
                <label htmlFor="image-upload" className="cursor-pointer text-green-700 hover:text-green-800 font-semibold flex items-center justify-center">
                  <PlusIcon className="h-5 w-5 mr-2" /> Add Images
                </label>
                <div className="mt-2 text-sm text-gray-600">
                  {imageFiles.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-800 text-left">
                      {imageFiles.map((file, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span>{file.name}</span>
                          {uploadProgress[file.name] !== undefined && (
                            <span className="ml-2">{uploadProgress[file.name].toFixed(0)}%</span>
                          )}
                          <button
                            onClick={() => handleRemoveFile(file.name, 'image')}
                            className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                          >
                            &times;
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedFileType === 'video' && (
            <div>
              <div className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                <input
                  type="file"
                  id="video-upload"
                  multiple
                  onChange={(e) => handleFileChange(e, 'video')}
                  className="sr-only"
                  accept="video/*"
                />
                <label htmlFor="video-upload" className="cursor-pointer text-green-700 hover:text-green-800 font-semibold flex items-center justify-center">
                  <PlusIcon className="h-5 w-5 mr-2" /> Add Videos
                </label>
                <div className="mt-2 text-sm text-gray-600">
                  {videoFiles.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-800 text-left">
                      {videoFiles.map((file, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span>{file.name}</span>
                          {uploadProgress[file.name] !== undefined && (
                            <span className="ml-2">{uploadProgress[file.name].toFixed(0)}%</span>
                          )}
                          <button
                            onClick={() => handleRemoveFile(file.name, 'video')}
                            className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                          >
                            &times;
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-800 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Gallery Item'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGalleryItemModal; 