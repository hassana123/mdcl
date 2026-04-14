"use client";
import React, { useEffect, useState } from 'react';
import { collection, addDoc, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PlusIcon } from 'lucide-react';
import { buildCloudinaryAsset, deleteCloudinaryAsset, uploadToCloudinary } from '@/lib/cloudinary';
import UploadDropzone from '@/components/admin/UploadDropzone';

const AddPolicyModal = ({ isOpen, onClose, onResourceAdded, editData = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    if (editData) {
      setTitle(editData.title || '');
      setDescription(editData.description || '');
    }
  }, [editData]);

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
    }
    e.target.value = null;
  };

  const handlePdfSelected = (files) => {
    const file = files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const handleUpload = async () => {
    if (!title || (!pdfFile && !editData?.pdfUrl)) {
      setError("Please provide a title and PDF file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let pdfUrl = editData?.pdfUrl || null;
      let pdfAsset = editData?.pdfAsset || null;

      if (pdfFile) {
        setUploadProgress(prev => ({ ...prev, pdf: 25 }));
        const uploadedPdf = await uploadToCloudinary(pdfFile, {
          folder: `mdcl/resources/others/${title}`,
          resourceType: 'auto',
        });
        pdfAsset = buildCloudinaryAsset(uploadedPdf);
        pdfUrl = pdfAsset?.url || null;
        setUploadProgress(prev => ({ ...prev, pdf: 100 }));

        if (editData?.pdfAsset?.publicId) {
          await deleteCloudinaryAsset(editData.pdfAsset);
        }
      }

      if (editData) {
        await updateDoc(doc(db, 'resources', editData.id), {
          title,
          description,
          pdfUrl,
          pdfAsset,
          category: 'others',
          updatedAt: Timestamp.now(),
        });
      } else {
        await addDoc(collection(db, 'resources'), {
          title,
          description,
          pdfUrl,
          pdfAsset,
          category: 'others',
          createdAt: Timestamp.now(),
        });
      }

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

  const handleDelete = async () => {
    if (!editData) return;

    setLoading(true);
    try {
      if (editData.pdfAsset?.publicId) {
        await deleteCloudinaryAsset(editData.pdfAsset);
      }

      await deleteDoc(doc(db, 'resources', editData.id));
      onResourceAdded();
      onClose();
    } catch (err) {
      console.error("Error deleting resource:", err);
      setError("Failed to delete resource. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{editData ? 'Edit Resource' : 'Add Resource'}</h3>
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
            <div className="mt-1">
              <UploadDropzone
                accept=".pdf,application/pdf"
                disabled={loading}
                onFilesSelected={handlePdfSelected}
                title="Click to upload a PDF or drag and drop"
                subtitle="Policy or resource PDF"
              />
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
          {editData && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              disabled={loading}
            >
              Delete
            </button>
          )}
          <button
            onClick={handleUpload}
            className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-800 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : editData ? 'Update Resource' : 'Add Resource'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPolicyModal; 
