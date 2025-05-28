"use client";
import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

const AddGalleryItemModal = ({ isOpen, onClose, onGalleryItemAdded }) => {
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!title || files.length === 0) {
      setError("Please provide a title and select at least one image.");
      return;
    }

    setLoading(true);
    setError(null);
    const imageUrls = [];
    const uploadPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `gallery/${file.name}`);
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
              imageUrls.push(downloadURL);
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
        images: imageUrls,
        createdAt: Timestamp.now(),
      });

      // Reset form and close modal
      setTitle('');
      setFiles([]);
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
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Gallery Item</h3>
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
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images</label>
            <input
              type="file"
              id="images"
              multiple
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
             <div className="mt-2 text-sm text-gray-600">
              {files.length > 0 && <p>{files.length} file(s) selected</p>}
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                 <p key={fileName}>{fileName}: {progress.toFixed(0)}% uploaded</p>
              ))}
             </div>
          </div>
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