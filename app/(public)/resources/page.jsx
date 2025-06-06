"use client"

import { NewspaperIcon, FileTextIcon, LibraryIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Banner from '@/components/Banner';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Resources() {
  const [previewNewsletters, setPreviewNewsletters] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [previewError, setPreviewError] = useState(null);
  const [previewFacts, setPreviewFacts] = useState([]);
  const [loadingFacts, setLoadingFacts] = useState(true);
  const [factsError, setFactsError] = useState(null);

  const dummyOtherResources = ["Resource 1", "Resource 2", "Resource 3"];

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

  const fetchPreviewFacts = async () => {
    try {
      setLoadingFacts(true);
      const resourcesRef = collection(db, 'resources');
      const q = query(
        resourcesRef,
        where('category', '==', 'facts'),
        orderBy('title', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const factsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPreviewFacts(factsData.slice(0, 3));
      setLoadingFacts(false);
    } catch (e) {
      console.error("Error fetching preview facts:", e);
      setFactsError("Failed to load facts preview.");
      setLoadingFacts(false);
    }
  };

  useEffect(() => {
    fetchPreviewNewsletters();
    fetchPreviewFacts();
  }, []);

  return (
    <>
      <Banner
        title="Our Resources"
        subtitle={
          <span className="text-center font-medium text-white/70">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <Link
              href="/resources"
              className="hover:underline text-white font-bold"
            >
              Resources
            </Link>{" "}
          </span>
        }
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Newsletters Card */}
          <div
            className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer border-t-4 border-t-green-700 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
          >
            <NewspaperIcon className="mx-auto h-12 w-12 text-green-700 mb-4" />
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

          {/* Fact Sheets Card */}
          <div
            className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer border-t-4 border-t-green-700 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
          >
            <FileTextIcon className="mx-auto h-12 w-12 text-green-700 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Fact Sheets</h2>
            <div className="text-left w-full flex-grow">
              {loadingFacts ? (
                <p className="text-sm text-gray-600">Loading preview...</p>
              ) : factsError ? (
                <p className="text-sm text-red-500">{factsError}</p>
              ) : previewFacts.length === 0 ? (
                <p className="text-sm text-gray-600">No recent facts.</p>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {previewFacts.map((fact) => (
                    <li key={fact.id} className="line-clamp-1">
                      <a
                        href={fact.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-gray-700"
                      >
                        {fact.title || 'Untitled'}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-auto pt-4 text-center">
              <Link href="/resources/facts" className="text-sm text-green-700 hover:underline">
                See More Fact Sheets
              </Link>
            </div>
          </div>

          {/* Other Resources Card */}
          <div
            className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer border-t-4 border-t-green-700 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
          >
            <LibraryIcon className="mx-auto h-12 w-12 text-green-700 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Other Resources</h2>
             <div className="text-left w-full flex-grow">
               <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                 {dummyOtherResources.map((resource, index) => (
                   <li key={index} className="line-clamp-1">{resource}</li>
                 ))}
               </ul>
             </div>
              <div className="mt-auto pt-4 text-center">
                 <Link href="/resources/others" className="text-sm text-green-700 hover:underline">
                   See More Resources
                 </Link>
               </div>
          </div>
        </div>
      </div>
    </>
  );
}
