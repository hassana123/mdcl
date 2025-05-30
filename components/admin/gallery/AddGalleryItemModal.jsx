"use client";
import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { PlusIcon } from 'lucide-react';

const AddGalleryItemModal = ({ isOpen, onClose, onGalleryItemAdded }) => {
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('image');
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);

  const filesToUpload = [...imageFiles, ...videoFiles];

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

  const handleUpload = async () => {
    if (!title || filesToUpload.length === 0) {
      setError("Please provide a title and select at least one image or video.");
      return;
    }

    setLoading(true);
    setError(null);
    const imageUrls = [];
    const videoUrls = [];
    const uploadPromises = filesToUpload.map(file => {
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
                imageUrls.push(downloadURL);
              } else if (isVideo) {
                videoUrls.push(downloadURL);
              }
              resolve();
            }).catch(reject);
          }
        );
      });
    });

    try {
      await Promise.all(uploadPromises);

      await addDoc(collection(db, 'gallery'), {
        title,
        description,
        images: imageUrls,
        videos: videoUrls,
        createdAt: Timestamp.now(),
      });

      setTitle('');
      setDescription('');
      setImageFiles([]);
      setVideoFiles([]);
      setUploadProgress({});
      onGalleryItemAdded();
      onClose();

    } catch (err) {
      console.error("Error adding gallery item:", err);
      setError("Failed to add gallery item.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Gallery Item</h3>
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
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
                  <PlusIcon className="h-5 w-5 mr-2" /> Click to select images or drag and drop
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
                  {imageFiles.length === 0 && <p>No images selected.</p>}
                </div>
              </div>
            </div>
          )}

          {selectedFileType === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Videos</label>
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
                   <PlusIcon className="h-5 w-5 mr-2" /> Click to select videos or drag and drop
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
                   {videoFiles.length === 0 && <p>No videos selected.</p>}
                 </div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
        <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-800 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Gallery Item'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGalleryItemModal; 