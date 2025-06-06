"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const AdminDashboard = () => {
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalResources, setTotalResources] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      setTotalProjects(projectsSnapshot.size);

      const blogsSnapshot = await getDocs(collection(db, 'blogs'));
      setTotalBlogs(blogsSnapshot.size);

      const resourcesSnapshot = await getDocs(collection(db, 'resources'));
      setTotalResources(resourcesSnapshot.size);
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Welcome Message */}
      <div className="mb-8 space-y-5 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Welcome to your MDCL dashboard</h2>
        <p className="text-gray-600">Admin</p>
      </div>
      {/* Dashboard Overview */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Dashboard Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Overview Cards */}
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="p-3 bg-blue-200 rounded-full mr-4">
              {/* Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Projects</div>
              <div className="text-2xl font-bold text-gray-800">{totalProjects}</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="p-3 bg-yellow-200 rounded-full mr-4">
              {/* Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Blogs</div>
              <div className="text-2xl font-bold text-gray-800">{totalBlogs}</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="p-3 bg-red-200 rounded-full mr-4">
              {/* Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Resources</div>
              <div className="text-2xl font-bold text-gray-800">{totalResources}</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4"></h3> {/* Title seems missing in image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quick Action Cards */}
          <Link href="/admin/projects" className="bg-white p-4 rounded-lg shadow flex items-center hover:bg-gray-50">
            <div className="p-3 bg-orange-200 rounded-full mr-4">
              {/* Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-800">Projects & Programmes</span>
          </Link>
          <Link href="/admin/gallery" className="bg-white p-4 rounded-lg shadow flex items-center hover:bg-gray-50">
            <div className="p-3 bg-teal-200 rounded-full mr-4">
              {/* Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-800">Gallery</span>
          </Link>
          <Link href="/admin/blog" className="bg-white p-4 rounded-lg shadow flex items-center hover:bg-gray-50">
            <div className="p-3 bg-purple-200 rounded-full mr-4">
              {/* Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-800">Blog</span>
          </Link>
          <Link href="/admin/resources" className="bg-white p-4 rounded-lg shadow flex items-center hover:bg-gray-50">
            <div className="p-3 bg-pink-200 rounded-full mr-4">
              {/* Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-800">Resources</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard; 