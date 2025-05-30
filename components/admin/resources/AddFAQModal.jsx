"use client";
import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const AddFAQModal = ({ isOpen, onClose, onResourceAdded }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!question || !answer) {
      setError("Please provide both question and answer.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, 'resources'), {
        question,
        answer,
        category: 'faq',
        createdAt: Timestamp.now(),
      });

      // Reset form
      setQuestion('');
      setAnswer('');

      onResourceAdded();
      onClose();

    } catch (err) {
      console.error("Error adding FAQ:", err);
      setError("Failed to add FAQ. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add FAQ</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700">Question</label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Answer</label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            ></textarea>
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
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-800 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add FAQ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFAQModal; 