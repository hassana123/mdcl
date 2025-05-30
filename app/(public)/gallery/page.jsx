"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Banner from "@/components/Banner";
import Image from "next/image";

const primaryColors = [
  'var(--color-primary-brown)',
  'var(--color-primary-light-brown)',
  'var(--color-primary-olive)',
  'var(--color-primary-light-olive)',
  'var(--color-primary-magenta)',
  'var(--color-primary-fuchia)',
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("images");
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const galleryRef = collection(db, 'gallery');
        const q = query(galleryRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Set type based on whether the item has images or videos
          type: doc.data().images?.length > 0 ? 'images' : 'videos',
          createdAt: doc.data().createdAt?.toDate()
        }));
        
        setGalleryItems(items);
      } catch (error) {
        console.error('Error fetching gallery items:', error);
        setError('Failed to load gallery items');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const filteredData = galleryItems.filter((item) => item.type === activeTab);

  // Function to truncate text
  const truncateText = (text, maxWords = 10) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  return (
    <>
      {/* Hero Section */}
      <Banner
        title="Gallery"
        subtitle={
          <span className="text-center font-medium text-white/70">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <Link
              href="/gallery"
              className="hover:underline text-white font-bold"
            >
              Gallery
            </Link>{" "}
          </span>
        }
      />
      {/* Gallery Content */}
      <section className="py-16 bg-background">
        <div className="w-[95%] md:w-[85%] mx-auto px-4">
          {/* Gallery Title */}
          <div className="mb-8">
            <div className="flex gap-2 mb-5 items-center">
              <span className="block w-[3px] h-[45px] bg-[var(--color-primary-olive)]"></span>
              <h2 className="text-2xl font-bold">Gallery</h2>
            </div>
            {/* Tabs */}
           <div className=" inline-block p-3 rounded-lg bg-gray-200 mb-8">
           <div className="flex ">
              <button
                onClick={() => setActiveTab("images")}
                className={`px-8 py-3 font-medium text-sm rounded-lg transition-colors ${
                  activeTab === "images"
                    ? "border-[var(--color-primary-olive)] text-white bg-[var(--color-primary-olive)]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Images
              </button>
              <button
                onClick={() => setActiveTab("videos")}
                className={`px-8 py-3 font-medium text-sm rounded-lg transition-colors ${
                  activeTab === "videos"
                    ? "border-[var(--color-primary-olive)] text-white bg-[var(--color-primary-olive)]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Videos
              </button>
            </div>

            </div>          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-olive)]"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Gallery Grid */}
          {!loading && !error && (
            activeTab === "images" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredData.map((item, index) => (
                  <div
                    key={item.id}
                    className="border-none rounded-lg overflow-hidden shadow-md"
                  >
                    <div className="relative w-full h-[50vh]">
                      {item.images?.[0] ? (
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={index < 2}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">No image available</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                        {truncateText(item.title)}
                      </h3>
                      <Link
                        href={`/gallery/${item.id}`}
                        className="text-[var(--color-primary-olive)] underline text-md hover:font-bold"
                      >
                        View Images
                      </Link>
                    </div>
                    <hr 
                      className="border mb-5 mx-5" 
                      style={{ borderColor: primaryColors[index % primaryColors.length] }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500">
                  No videos available at the moment.
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}
