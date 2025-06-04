"use client";
import React, { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


const capturePdfCover = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const canvas = document.querySelector('.react-pdf__Page__canvas');
      if (!canvas) {
        reject('Canvas not found');
        return;
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          reject('Failed to convert canvas to image');
        } else {
          resolve(blob);
        }
      }, 'image/jpeg', 0.8); // Save as JPEG
    }, 500); // wait for canvas to be rendered
  });
};
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs";

}

const AddNewsletterModal = ({ isOpen, onClose, onResourceAdded, editData = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  //console.log(pdfjs);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title || '');
      setDescription(editData.description || '');
      if (editData.coverImage) {
        setPdfPreview(editData.coverImage);
      }
    }
  }, [editData]);

  const generatePdfPreview = async (file) => {
    try {
      const url = URL.createObjectURL(file);
      setPdfPreview(url);
      return url;
    } catch (err) {
      console.error('Error generating PDF preview:', err);
      throw err;
    }
  };

  const handlePdfChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      try {
        await generatePdfPreview(file);
      } catch (err) {
        console.error('Error generating preview:', err);
        setError('Failed to generate PDF preview. Please try again.');
      }
    }
    e.target.value = null;
  };

  const handleUpload = async () => {
    if (!title || (!pdfFile && !editData?.pdfUrl)) {
      setError("Please provide a title and PDF file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let pdfUrl = editData?.pdfUrl;
      let coverImageUrl = editData?.coverImage;

      // Upload PDF if new one is selected
      if (pdfFile) {
        const pdfPath = `resources/newsletters/${title}/pdf/${pdfFile.name}`;
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

        pdfUrl = await getDownloadURL(pdfRef);

        // Upload preview image
        if (pdfFile && pdfPreview) {
          const previewBlob = await capturePdfCover(); // ← we use the helper function
          const previewPath = `resources/newsletters/${title}/preview/preview.jpg`;
          const previewRef = ref(storage, previewPath);
          await uploadBytesResumable(previewRef, previewBlob);
          coverImageUrl = await getDownloadURL(previewRef);
        }

        // Delete old files if they exist
        if (editData?.pdfUrl) {
          const oldPdfRef = ref(storage, editData.pdfUrl);
          await deleteObject(oldPdfRef);
        }
        if (editData?.coverImage) {
          const oldPreviewRef = ref(storage, editData.coverImage);
          await deleteObject(oldPreviewRef);
        }
      }

      if (editData) {
        // Update existing newsletter
        const newsletterRef = doc(db, 'resources', editData.id);
        await updateDoc(newsletterRef, {
          title,
          description,
          coverImage: coverImageUrl,
          pdfUrl,
          updatedAt: Timestamp.now(),
        });
      } else {
        // Add new newsletter
        await addDoc(collection(db, 'resources'), {
          title,
          description,
          coverImage: coverImageUrl,
          pdfUrl,
          category: 'newsletter',
          createdAt: Timestamp.now(),
        });
      }

      // Reset form
      setTitle('');
      setDescription('');
      setPdfFile(null);
      setPdfPreview(null);
      setUploadProgress({});

      onResourceAdded();
      onClose();

    } catch (err) {
      console.error("Error handling newsletter:", err);
      setError("Failed to process newsletter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editData) return;

    setLoading(true);
    try {
      // Delete files from storage
      if (editData.coverImage) {
        const coverImageRef = ref(storage, editData.coverImage);
        await deleteObject(coverImageRef);
      }
      if (editData.pdfUrl) {
        const pdfRef = ref(storage, editData.pdfUrl);
        await deleteObject(pdfRef);
      }

      // Delete document from Firestore
      await deleteDoc(doc(db, 'resources', editData.id));

      onResourceAdded();
      onClose();
    } catch (err) {
      console.error("Error deleting newsletter:", err);
      setError("Failed to delete newsletter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {editData ? 'Edit Newsletter' : 'Add Newsletter'}
        </h3>
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

          {/* PDF Preview */}
          {(pdfPreview || editData?.coverImage) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PDF Preview</label>
              <div className="mt-1 border border-gray-300 rounded-md overflow-hidden w-32 h-32 flex items-center justify-center">
                {pdfPreview ? (
                  <Document file={pdfPreview}>
                    <Page pageNumber={1} width={128} />
                  </Document>
                ) : (
                  <Image
                    src={editData.coverImage}
                    alt="PDF Preview"
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover"
                  />
                )}
              </div>
            </div>
          )}

          {/* PDF Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Newsletter PDF</label>
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
              {editData?.pdfUrl && !pdfFile && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Current PDF attached</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
        <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
          {editData && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <Trash2Icon className="h-5 w-5" />
            </button>
          )}
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
            {loading ? 'Processing...' : editData ? 'Update Newsletter' : 'Add Newsletter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewsletterModal; 