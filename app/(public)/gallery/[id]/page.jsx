import Link from "next/link"
import { ChevronLeft } from "lucide-react"

// Dummy gallery data (same as in the main gallery page)
const galleryData = [
  {
    id: 1,
    title:
      "2010: FACILITATION OF TRIPARTITE AGREEMENT BETWEEN CADP, MARKET ASSOCIATIONS, AND THE COMMERCIAL AGRICULTURE DEVELOPMENT ASSOCIATION (CADA), UNDER THE WORLD BANK-ASSISTED COMMERCIAL AGRICULTURE DEVELOPMENT PROJECT'S DEVELOPMENT OF MARKET INFORMATION KIOSKS IN KADUNA STATE",
    year: "2010",
    type: "images",
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    description:
      "This project facilitated a tripartite agreement between CADP, Market Associations, and the Commercial Agriculture Development Association (CADA) under the World Bank-assisted Commercial Agriculture Development Project for the development of market information kiosks in Kaduna State.",
  },
  {
    id: 2,
    title: "TRAINING WORKSHOPS FOR FCT SHARIA COURT OF APPEAL (2010 - 2014)",
    year: "2010-2014",
    type: "images",
    images: ["/placeholder.jpg", "/placeholder.jpg"],
    description: "Training workshops conducted for FCT Sharia Court of Appeal staff from 2010 to 2014.",
  },
  // Add more items as needed...
]

export default async function GalleryDetailPage({ params }) {
  const galleryItem = galleryData.find((item) => item.id === Number.parseInt(params.id))

  if (!galleryItem) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Gallery Item Not Found</h1>
          <Link href="/gallery" className="text-olive hover:underline">
            Back to Gallery
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative h-64 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/placeholder.jpg')",
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-2">Gallery</h1>
          <nav className="text-sm">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Gallery</span>
          </nav>
        </div>
      </section>

      {/* Gallery Detail Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/gallery"
            className="inline-flex items-center text-gray-600 hover:text-olive transition-colors mb-8"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </Link>

          {/* Gallery Item Title */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold leading-tight max-w-4xl mx-auto">{galleryItem.title}</h2>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {galleryItem.images.map((image, index) => (
              <div key={index} className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                {/* Replace with actual image when available */}
                {/* <Image 
                  src={image || "/placeholder.svg"} 
                  alt={`${galleryItem.title} - Image ${index + 1}`} 
                  fill 
                  className="object-cover"
                /> */}
              </div>
            ))}
          </div>

          {/* Description (if available) */}
          {/* {galleryItem.description && (
            <div className="max-w-4xl mx-auto mt-12">
              <h3 className="text-xl font-semibold mb-4">About this Project</h3>
              <p className="text-gray-700 leading-relaxed">{galleryItem.description}</p>
            </div>
          )} */}
        </div>
      </section>
    </>
  )
}
