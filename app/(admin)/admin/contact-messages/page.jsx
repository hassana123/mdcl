"use client"
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, startAfter, getDocs, doc, updateDoc, deleteDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Eye, Trash2, CheckCircle2, X } from 'lucide-react';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [hasMore, setHasMore] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async (isInitial = false) => {
    try {
      setLoading(true);
      let q;

      if (isInitial) {
        // Initial load with filter
        if (filter === 'all') {
          q = query(
            collection(db, 'contactMessages'),
            orderBy('timestamp', 'desc'),
            limit(10)
          );
        } else {
          q = query(
            collection(db, 'contactMessages'),
            where('isRead', '==', filter === 'read'),
            orderBy('timestamp', 'desc'),
            limit(10)
          );
        }
      } else {
        // Pagination with filter
        if (filter === 'all') {
          q = query(
            collection(db, 'contactMessages'),
            orderBy('timestamp', 'desc'),
            startAfter(lastDoc),
            limit(10)
          );
        } else {
          q = query(
            collection(db, 'contactMessages'),
            where('isRead', '==', filter === 'read'),
            orderBy('timestamp', 'desc'),
            startAfter(lastDoc),
            limit(10)
          );
        }
      }

      const querySnapshot = await getDocs(q);
      const newMessages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (isInitial) {
        setMessages(newMessages);
      } else {
        setMessages(prev => [...prev, ...newMessages]);
      }

      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === 10);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLastDoc(null); // Reset lastDoc when filter changes
    fetchMessages(true);
  }, [filter]);

  const handleMarkAsRead = async (messageId) => {
    try {
      const messageRef = doc(db, 'contactMessages', messageId);
      await updateDoc(messageRef, { isRead: true });
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await deleteDoc(doc(db, 'contactMessages', messageId));
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const truncateMessage = (message) => {
    const words = message.split(' ');
    return words.length > 1 ? `${words[0]}...` : message;
  };

  const MessageModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
      <div className="fixed inset-0 bg-black/20  flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Message Details</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">From</h3>
                <p className="mt-1">{message.from_name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1">{message.from_email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="mt-1">
                  {new Date(message.timestamp?.toDate()).toLocaleString()}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Message</h3>
                <p className="mt-1 whitespace-pre-wrap">{message.message}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  message.isRead ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {message.isRead ? 'Read' : 'Unread'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {!message.isRead && (
                <button
                  onClick={() => {
                    handleMarkAsRead(message.id);
                    onClose();
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => {
                  handleDelete(message.id);
                  onClose();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)]"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((message) => (
              <tr key={message.id} className={!message.isRead ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{message.from_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{message.from_email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {truncateMessage(message.message)}
                    <button
                      onClick={() => setSelectedMessage(message)}
                      className="ml-2 text-[color:var(--color-primary-olive)] hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(message.timestamp?.toDate()).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    message.isRead ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {message.isRead ? 'Read' : 'Unread'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    {!message.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(message.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => fetchMessages(false)}
            disabled={loading}
            className="bg-[color:var(--color-primary-light-brown)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[color:var(--color-primary-olive)] transition-colors disabled:opacity-60"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  );
};

export default ContactMessages; 