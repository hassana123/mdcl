"use client"

import { FileTextIcon, FileQuestionIcon, ScaleIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Banner from '@/components/Banner';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Resources() {
  const [previewNewsletters, setPreviewNewsletters] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [previewError, setPreviewError] = useState(null);

  const dummyFAQs = ["FAQ Title 1", "FAQ Title 2", "FAQ Title 3"];
  const dummyPolicies = ["Policy Title A", "Policy Title B", "Policy Title C"];

  const fetchPreviewNewsletters = async () => {
    try {
      setLoadingPreview(true);
      const resourcesRef = collection(db, 'resources');
      const q = query(
        resourcesRef,
        where('category', '==', 'newsletter'),
        orderBy('title', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const newslettersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPreviewNewsletters(newslettersData.slice(0, 3));
      setLoadingPreview(false);
    } catch (e) {
      console.error("Error fetching preview newsletters:", e);
      setPreviewError("Failed to load newsletter preview.");
      setLoadingPreview(false);
    }
  };

  useEffect(() => {
    fetchPreviewNewsletters();
  }, []);

  return (
    <>
      <Banner title="Our Resources" subtitle="Explore our Newsletters, FAQs, and Policies" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Newsletters Card */}
          <div
            className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer border-t-4 border-t-green-700 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
           
          >
            <FileTextIcon className="mx-auto h-12 w-12 text-green-700 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Newsletters</h2>
            <div className="text-left w-full flex-grow">
              {loadingPreview ? (
                <p className="text-sm text-gray-600">Loading preview...</p>
              ) : previewError ? (
                <p className="text-sm text-red-500">{previewError}</p>
              ) : previewNewsletters.length === 0 ? (
                 <p className="text-sm text-gray-600">No recent newsletters.</p>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {previewNewsletters.map((nl) => (
                    <li key={nl.id} className="line-clamp-1">
                      <a
                        href={nl.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-gray-700"
                      >
                        {nl.title || 'Untitled'}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-auto pt-4 text-center">
               <Link href="/resources/newsletter" className="text-sm text-green-700 hover:underline">
                 See More Newsletters
               </Link>
            </div>
          </div>

          {/* FAQs Sheet Card */}
          <div
            className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer border-t-4 border-t-green-700 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
            onClick={() => window.location.href = '/resources/faq'}
          >
            <FileQuestionIcon className="mx-auto h-12 w-12 text-green-700 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">FAQs Sheet</h2>
             <div className="text-left w-full flex-grow">
               <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                 {dummyFAQs.map((faq, index) => (
                   <li key={index} className="line-clamp-1">{faq}</li>
                 ))}
               </ul>
             </div>
             <div className="mt-auto pt-4 text-center">
                 <Link href="/resources/faq" className="text-sm text-green-700 hover:underline">
                   See More FAQs
                 </Link>
              </div>
          </div>

          {/* Policies Card */}
          <div
            className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer border-t-4 border-t-green-700 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
            onClick={() => window.location.href = '/resources/policy'}
          >
            <ScaleIcon className="mx-auto h-12 w-12 text-green-700 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Policies</h2>
             <div className="text-left w-full flex-grow">
               <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                 {dummyPolicies.map((policy, index) => (
                   <li key={index} className="line-clamp-1">{policy}</li>
                 ))}
               </ul>
             </div>
              <div className="mt-auto pt-4 text-center">
                 <Link href="/resources/policy" className="text-sm text-green-700 hover:underline">
                   See More Policies
                 </Link>
               </div>
          </div>
        </div>
      </div>
    </>

  );
}
