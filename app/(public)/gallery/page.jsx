"use client";
import Link from "next/link";
import { useState } from "react";

import Banner from "@/components/Banner";
// Dummy gallery data
const galleryData = [
  {
    id: 1,
    title:
      "2010: FACILITATION OF TRIPARTITE AGREEMENT BETWEEN CADP, MARKET ASSOCIATIONS, AND...",
    year: "2010",
    type: "images",
    images: ["/placeholder.jpg", "/placeholder.jpg"],
  },
  {
    id: 2,
    title: "TRAINING WORKSHOPS FOR FCT SHARIA COURT OF APPEAL (2010 - 2014)",
    year: "2010-2014",
    type: "images",
    images: ["/placeholder.jpg"],
  },
  {
    id: 3,
    title: "2014 TRAINING ON CORPORATE GOVERNANCE (NNPC)",
    year: "2014",
    type: "images",
    images: ["/placeholder.jpg"],
  },
  {
    id: 4,
    title:
      "FINANCIAL LITERACY SENSITISATION AND AWARENESS WORKSHOPS IN MINNA AND SOKOTO (2016) ON BEHALF OF",
    year: "2016",
    type: "images",
    images: ["/placeholder.jpg"],
  },
  {
    id: 5,
    title:
      "2015: CAPACITY DEVELOPMENT SUPPORT FOR TRACTORS OWNERS AND OPERATORS ASSOCIATION OF NIGERIA (TOOAN) UNDER DFID'S PROPCOM MAIKARFI",
    year: "2015",
    type: "images",
    images: ["/placeholder.jpg"],
  },
  {
    id: 6,
    title:
      "POSITIVE VOICES CAMPAIGN PROJECT (PVCP) DEVELOPED AND IMPLEMENTED ON BEHALF OF BRITISH COUNCIL/NIGERIA...",
    year: "2015",
    type: "images",
    images: ["/placeholder.jpg"],
  },
  {
    id: 7,
    title:
      "TRAINING FOR NEWLY RECRUITED STAFF OF KADUNA STATE TRAFFIC AND ENVIRONMENTAL LAW ENFORCEMENT AGENCY (KASTELEA) IN 2016",
    year: "2016",
    type: "images",
    images: ["/placeholder.jpg"],
  },
  {
    id: 8,
    title:
      "TRAINING ON TAX MATTERS AND FINANCIAL RECORDS MAINTENANCE FOR WOMEN ENTREPRENEURS (2016)",
    year: "2016",
    type: "images",
    images: ["/placeholder.jpg"],
  },
  {
    id: 9,
    title:
      "2016 TRAINING FOR FARMERS IN 2016 ON BEHALF OF CBN'S ANCHOR BORROWERS PROGRAMME",
    year: "2016",
    type: "images",
    images: ["/placeholder.jpg"],
  },
  {
    id: 10,
    title:
      "2017: DFID'S GEMS: TRAINING FOR KADUNA STATE MDAS ON BUSINESS LICENSING REFORMS",
    year: "2017",
    type: "images",
    images: ["/placeholder.jpg"],
  },
  {
    id: 11,
    title:
      "2017: CAPACITY DEVELOPMENT SUPPORT AND ESTABLISHMENT OF RESULTS DELIVERY UNITS (RDUs) ON BEHALF OF KADUNA STATE GOVERNMENT",
    year: "2017",
    type: "images",
    images: ["/placeholder.jpg"],
  },
  {
    id: 12,
    title:
      "TRAINING AND EMPOWERMENT FOR YOUNG WOMEN IN KADUNA METROPOLIS IN 2019 (NIGERIAN PORTS AUTHORITY (NPA): CORPORATE SOCIAL RESPONSIBILITY)",
    year: "2019",
    type: "images",
    images: ["/placeholder.jpg"],
  },
];

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

  const filteredData = galleryData.filter((item) => item.type === activeTab);

  return (
    <>
      {/* Hero Section */}
      <Banner
        title="Gallery"
        subtitle={
          <span className="text-center font-medium text-white/70">
            <Link href="/" className="hover:underline ">
              Home
            </Link>{" "}
            /{" "}
            <Link
              href="/gallery"
              className="hover:underline text-white font-bold "
            >
              Gallery
            </Link>{" "}
          </span>
        }
        
      />
      {/* Gallery Content */}
      <section className="py-16 bg-background">
        <div className=" w-[95%] md:w-[85%] mx-auto px-4">
          {/* Gallery Title */}
          <div className="mb-8">
            <div className=" flex gap-2 mb-5 items-center">
              <span className="block w-[3px] h-[45px] bg-[var(--color-primary-olive)]"></span>
              <h2 className="text-2xl font-bold ">Gallery</h2>
            </div>
            {/* Tabs */}
            <div className="w-[20%] flex p-3 rounded-lg  bg-gray-200 mb-8">
              <button
                onClick={() => setActiveTab("images")}
                className={`px-8 py-3 font-medium text-sm  rounded-lg transition-colors ${
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
          </div>

          {/* Gallery Grid */}
          {activeTab === "images" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredData.map((item, index) => (
                <div
                  key={item.id}
                  className="border-none rounded-lg overflow-hidden shadow-md"
                >
                  <img
                  loading="lazy"
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2">
                      {item.title}
                    </h3>
                    <Link
                      href={`/gallery/${item.id}`}
                      className="text-[var(--color-primary-olive)] underline text-md hover:font-bold"
                    >
                      View Images
                    </Link>
                  </div>
                  <hr className="border mb-5 mx-5" style={{ borderColor: primaryColors[index % primaryColors.length] }}/>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">
                No videos available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
