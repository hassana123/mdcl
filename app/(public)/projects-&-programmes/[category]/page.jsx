"use client";

import React from 'react';
import ProjectDisplay from '@/components/ProjectDisplay';

// Map URL-friendly category names to display names
const categoryMap = {
  'research': {
    title: 'Research Projects',
    subtitle: 'Explore our Research Projects',
    description: ''
  },
  'project-management': {
    title: 'Project Management',
    subtitle: 'Our project management Initiatives',
    description: ''
  },
  'capacity-development': {
    title: 'Capacity Development',
    subtitle: 'Building capabilities for the future',
    description: ''
  }
};

export default function CategoryPage({ params }) {
  const { category } = params;
  const categoryInfo = categoryMap[category] || {
    title: 'Projects & Programmes',
    subtitle: 'Our Projects & Programmes',
    description: 'Explore our projects and Programmes.'
  };

  return (
    <ProjectDisplay
      title={categoryInfo.title}
      subtitle={categoryInfo.subtitle}
      description={categoryInfo.description}
      category={category}
    />
  );
} 