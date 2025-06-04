"use client"
import HeroSection from "@/components/HeroSection";
import PreviewAboutUs from "@/components/PreviewAboutUs";
import PreviewSolutions from "@/components/PreviewSolutions";
import Partners from "@/components/Partners";
import Slideshow from "@/components/Slideshow";
import PreviewBlog from "@/components/PreviewBlog";
import PreviewNewsletter from "@/components/PreviewNewsletter";
import Contact from "@/components/Contact"; 
import PreviewProjects from "@/components/PreviewProjects";
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState, useEffect } from 'react';

export default function Home() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewsletters = async () => {
    try {
      const resourcesRef = collection(db, 'resources');
      const q = query(
        resourcesRef,
        where('category', '==', 'newsletter'),
        orderBy('title', 'asc') // Order by title alphabetically
      );
      const querySnapshot = await getDocs(q);
      const newslettersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNewsletters(newslettersData);
      setLoading(false);
    } catch (e) {
      console.error("Error fetching newsletters for home page:", e);
      setError("Failed to load newsletters.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  return (
    <main>
      <HeroSection/>
      <PreviewAboutUs/>
      <PreviewSolutions/>
      <PreviewProjects/>
      <Slideshow/>
      <Partners/>
      <PreviewBlog/>

      {loading ? (
        <p className="text-center">Loading newsletters...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : newsletters.length === 0 ? (
        <p className="text-center">No newsletters available at the moment.</p>
      ) : (
        <PreviewNewsletter newsletters={newsletters} limit={3} /> // Pass fetched data with a limit of 3
      )}

      <Contact/>
    </main>
  );
}
