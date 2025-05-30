"use client";
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Image from "next/image"
import Banner from "@/components/Banner"
import { use } from "react"
import { useParams } from "next/navigation";

// Dummy gallery data (same as in the main gallery page)

export default function GalleryDetailPage() {
  const params= useParams()
  const [galleryItem, setGalleryItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGalleryItem = async () => {
      try {
        setLoading(true)
        const docRef = doc(db, 'gallery', params.id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setGalleryItem({
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt?.toDate()
          })
        } else {
          setError('Gallery item not found')
        }
      } catch (error) {
        console.error('Error fetching gallery item:', error)
        setError('Failed to load gallery item')
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryItem()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-olive)]"></div>
        </div>
      </div>
    )
  }

  if (error || !galleryItem) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Gallery Item Not Found</h1>
          <Link href="/gallery" className="text-[var(--color-primary-olive)] hover:underline">
            Back to Gallery
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <Banner
        title={"Gallery"}
        subtitle={
          <span className="text-center font-medium text-white/70">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/gallery" className="hover:underline">
              Gallery
            </Link>{" "}
          </span>
        }
      />

      {/* Gallery Detail Content */}
      <section className="py-16 bg-background">
        <div className="w-[95%] md:w-[85%] mx-auto ">
          {/* Back Button */}
          <Link
            href="/gallery"
            className="inline-flex items-center text-gray-600 hover:text-[var(--color-primary-olive)] transition-colors mb-8"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </Link>

          {/* Gallery Item Title */}
          <div className="text-center mb-12">
            <h2 className="text-md md:text-lg font-bold leading-relaxed ">
              {galleryItem.title}
            </h2>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
            {galleryItem.images?.map((image, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`${galleryItem.title} - Image ${index + 1}`}
                  fill
                  className="object-contain rounded-lg"
                  // sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index < 2}
                />
              </div>
            ))}
          </div>

          {/* Description */}
          {galleryItem.description && (
            <div className="max-w-4xl mx-auto mt-12">
              <h3 className="text-xl font-semibold mb-4">About this Project</h3>
              <p className="text-gray-700 leading-relaxed">{galleryItem.description}</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
