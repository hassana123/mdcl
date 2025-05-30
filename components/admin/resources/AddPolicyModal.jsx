"use client";
import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { PlusIcon } from 'lucide-react';

const AddPolicyModal = ({ isOpen, onClose, onResourceAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
    }
    e.target.value = null;
  };

  const handleUpload = async () => {
    if (!title || !pdfFile) {
      setError("Please provide a title and PDF file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload PDF
      const pdfPath = `resources/policies/${title}/${pdfFile.name}`;
      const pdfRef = ref(storage, pdfPath);
      const pdfUpload = uploadBytesResumable(pdfRef, pdfFile);

      // Track upload progress
      pdfUpload.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(prev => ({ ...prev, pdf: progress }));
        },
        (error) => {
          console.error("PDF upload error:", error);
          throw error;
        }
      );

      // Wait for upload to complete
      await new Promise((resolve, reject) => {
        pdfUpload.on('state_changed',
          null,
          reject,
          () => resolve()
        );
      });

      // Get download URL
      const pdfUrl = await getDownloadURL(pdfRef);

      // Add to Firestore
      await addDoc(collection(db, 'resources'), {
        title,
        description,
        pdfUrl,
        category: 'policy',
        createdAt: Timestamp.now(),
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPdfFile(null);
      setUploadProgress({});

      onResourceAdded();
      onClose();

    } catch (err) {
      console.error("Error adding policy:", err);
      setError("Failed to add policy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Policy</h3>
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

          {/* PDF Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Policy PDF</label>
            <div className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              <input
                type="file"
                id="pdf-upload"
                onChange={handlePdfChange}
                className="sr-only"
                accept=".pdf"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer text-green-700 hover:text-green-800 font-semibold flex items-center justify-center">
                <PlusIcon className="h-5 w-5 mr-2" /> Select PDF File
              </label>
              {pdfFile && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{pdfFile.name}</p>
                  {uploadProgress.pdf !== undefined && (
                    <p className="text-sm text-gray-600">Uploading: {uploadProgress.pdf.toFixed(0)}%</p>
                  )}
                </div>
              )}
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
            {loading ? 'Adding...' : 'Add Policy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPolicyModal; 