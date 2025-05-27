import React, { useState } from 'react';
import Link from 'next/link';

const ProjectList = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories from projects, but only show All and Research initially
  const defaultCategories = ['All', 'Research'];
  const allCategories = ['All', ...new Set(projects.map(project => project.category))];
  const categories = allCategories.filter(cat => defaultCategories.includes(cat));

  // Filter projects based on category and search query
  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      {/* Filter and Sort Area */}
      <div className="flex items-center justify-between space-x-20 mb-6">
        <div className='flex items-center space-x-4'>
          <span className="text-gray-700 font-semibold">Sort by:</span>
          {/* Categories Dropdown */}
          <span className='block border border-gray-200 shadow-md px-4 outline-none rounded-xl py-2'>Categories</span>
          <select 
            className="border border-gray-200 shadow-md px-4 outline-none rounded-xl py-3"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pl-10 border border-gray-200 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category list section */}
      <div className="flex border-b border-b-gray-300 space-x-4 mb-6">
        {categories.map((category) => (
          <button 
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 my-2 text-gray-700 ${
              selectedCategory === category ? 'border-b rounded-lg border-b-green-700' : ''
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          No projects found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Project Image */}
              <div className="relative h-48 bg-gray-100">
                {project.images && project.images.length > 0 ? (
                  <img 
                    src={project.images[0]} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                {/* Title */}
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">{project.title}</h3>
                {/* Excerpt */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{project.excerpt}</p>
                {/* Date */}
                <p className="text-xs text-gray-500 mb-4">
                  {project.createdAt?.toLocaleDateString()}
                </p>
                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm">
                    Edit
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList; 