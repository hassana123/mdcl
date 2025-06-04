"use client"

import { FileTextIcon, FileQuestionIcon, ScaleIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Banner from '@/components/Banner';

export default function Resources() {
  return (
    <>
      <Banner title="Our Resources" subtitle="Explore our Newsletters, FAQs, and Policies" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Newsletters Card */}
          <Link href="/resources/newsletter">
            <div
              className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer border-t-4 border-t-green-700 hover:shadow-lg transition-shadow duration-200"
            >
              <FileTextIcon className="mx-auto h-12 w-12 text-green-700 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">Newsletters</h2>
            </div>
          </Link>

          {/* FAQs Sheet Card */}
          <Link href="/resources/faq">
            <div
              className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer border-t-4 border-t-green-700 hover:shadow-lg transition-shadow duration-200"
            >
              <FileQuestionIcon className="mx-auto h-12 w-12 text-green-700 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">FAQs Sheet</h2>
            </div>
          </Link>

          {/* Policies Card */}
          <Link href="/resources/policy">
            <div
              className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer border-t-4 border-t-green-700 hover:shadow-lg transition-shadow duration-200"
            >
              <ScaleIcon className="mx-auto h-12 w-12 text-green-700 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">Policies</h2>
            </div>
          </Link>
        </div>
      </div>
    </>

  );
}
