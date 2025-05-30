"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GalleryItemPage({ params }) {
  const { id } = params;
  const [galleryItem, setGalleryItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGalleryItem = async () => {
      try {
        const itemRef = doc(db, 'gallery', id);
        const itemSnap = await getDoc(itemRef);

        if (itemSnap.exists()) {
          setGalleryItem({ id: itemSnap.id, ...itemSnap.data() });
        } else {
          setError("Gallery item not found");
        }
      } catch (err) {
        console.error("Error fetching gallery item:", err);
        setError("Failed to load gallery item");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItem();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !galleryItem) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Gallery Item Not Found</h1>
        <Link href="/admin/gallery" className="text-green-700 hover:underline">
          Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className=" py-8">
  <div className='flex gap-1 mb-5 items-center'>
  <ArrowLeftIcon
          className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-800 mr-4"
          onClick={() => router.push('/admin/gallery')}
        />
        <span className='cursor-pointer hover:underline'  onClick={() => router.push('/admin/gallery')}>Back to Gallery</span>
  </div>
      <div className=" items-center mb-8">
        {/* Back Arrow */}
      
        {/* Title */}
        <h1 className="text-lg font-bold text-gray-800">{galleryItem.title || 'Gallery Item Details'}</h1>
      </div>

      {/* Images Grid */}
      {galleryItem.images && galleryItem.images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItem.images.map((image, index) => (
            <div key={index} className="relative w-full h-48 rounded-lg overflow-hidden shadow-md">
              <Image
                src={image}
                alt={`${galleryItem.title || 'Gallery Image'} ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-600">
          No images available for this gallery item.
        </div>
      )}
    </div>
  );
} 