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
import BlogPopupModal from "@/components/BlogPopupModal";

export default function Home() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewsletters = async () => {
    try {
      const resourcesRef = collection(db, 'resources');
      const q = query(
        resourcesRef,
        where('category', '==', 'newsletter')
      );
      const querySnapshot = await getDocs(q);
      const newslettersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort newsletters by volume and number numerically
      const sortedNewsletters = newslettersData.sort((a, b) => {
        // Extract volume and number from titles
        const getVolumeAndNumber = (title) => {
          const match = title.match(/Vol\.(\d+)\s+No\.(\d+)/);
          if (match) {
            return {
              volume: parseInt(match[1]),
              number: parseInt(match[2])
            };
          }
          return { volume: 0, number: 0 };
        };

        const aInfo = getVolumeAndNumber(a.title);
        const bInfo = getVolumeAndNumber(b.title);

        // First compare volumes
        if (aInfo.volume !== bInfo.volume) {
          return aInfo.volume - bInfo.volume;
        }
        // If volumes are equal, compare numbers
        return aInfo.number - bInfo.number;
      });

      setNewsletters(sortedNewsletters);
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
      {/* <Slideshow/> */}
      <Partners/>
      <PreviewBlog/>

      {loading ? (
        <PreviewNewsletter loading={true} />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : newsletters.length === 0 ? (
        <p className="text-center">No newsletters available at the moment.</p>
      ) : (
        <PreviewNewsletter newsletters={newsletters} limit={3} loading={false} />
      )}

      <Contact/>
      {/* <BlogPopupModal /> */}
      
    </main>
  );
}
