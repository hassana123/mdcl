"use client"
import { useState, useEffect } from "react";
import Banner from "./Banner";
import Partners from "./Partners";
import Link from "next/link";
import Image from "next/image";
import Deco from "./Deco";
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ProjectDisplay = ({
  title,
  subtitle,
  description,
  category = "Research",
}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsRef = collection(db, 'projects');
        
        // Normalize category name to match admin panel format
        const normalizedCategory = category
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        console.log('Fetching projects for category:', normalizedCategory);
        
        // Query for specific category
        const q = query(
          projectsRef,
          where('category', '==', normalizedCategory),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        console.log('Query results:', querySnapshot.docs.map(doc => ({
          id: doc.id,
          category: doc.data().category,
          title: doc.data().title,
          status: doc.data().status
        })));
        
        const projectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));
        
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [category]);

  

  return (
    <main className="bg-white min-h-screen">
      <Banner
        title={title}
        subtitle={subtitle}
       
      />
      <div className="lg:block hidden md:w-[85%] mx-auto">
        <Deco/>
      </div>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-3 text-[var(--color-title-text)]">{title}</h1>
        <p className="text-md text-gray-700 text-center mb-10">{description}</p>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-olive)]"></div>
          </div>
        ) : (
          <>
            {/* <div className="border-l-2 border-[var(--color-primary-olive)] pl-4 mb-8">
              <span className="font-semibold text-[var(--color-title-text)]">Our {category} projects include:</span>
            </div> */}
            
            {projects.length === 0 ? (
              <div className="text-center py-10 text-gray-600">
                No projects found in this category. (Category: {category})
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {projects.map((proj) => (
                  <div key={proj.id} className="flex flex-col">
                    <div className="relative w-full h-60 rounded-xl overflow-hidden mb-3">
                      {proj.images && proj.images.length > 0 ? (
                        <Image
                          src={proj.images[0]}
                          alt={proj.title}
                          fill
                          loading="lazy"
                          quality={100}
                          className="object-cover rounded-xl"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/projects/${category}/${proj.id}`}
                      className="font-semibold underline text-[var(--color-title-text)] mb-2 hover:text-[var(--color-primary-olive)]"
                    >
                      {proj.title}
                    </Link>
                    <p className="text-sm text-gray-700 mb-2">{proj.excerpt}</p>
                    <Link
                      href={`/projects-&-programmes/${category}/${proj.id}`}
                      className="text-[var(--color-primary-brown)] text-sm font-semibold hover:underline mt-auto flex items-center gap-1"
                    >
                      Read More <span className="text-lg">→</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
      <Partners />
    </main>
  );
};

export default ProjectDisplay; 