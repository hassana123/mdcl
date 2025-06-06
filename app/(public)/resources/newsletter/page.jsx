"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import PreviewNewsletter from '@/components/PreviewNewsletter'
import Banner from '@/components/Banner'
import Deco from '@/components/Deco'
import Partners from '@/components/Partners'
import LoadingSpinner from '@/components/LoadingSpinner'
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';

const Newsletter = () => {
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
      console.log(e);
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  return (
   <section>
        <Banner
            title="Newsletter"
            subtitle={
            <span className="text-center font-medium text-white/70">
                <Link href="/" className="hover:underline">Home</Link> /{" "}
                <Link href="/resources" className="hover:underline">Resources</Link> /{" "}
                <Link href="/resources/newsletter" className="hover:underline text-white font-bold">Newsletter</Link>
            </span>
            }
           
        />
      <div className='lg:block hidden'>
      <Deco />
      </div>
        <div className="">
          {loading ? (
            <PreviewNewsletter loading={true} />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : newsletters.length === 0 ? (
            <p>No newsletters available at the moment.</p>
          ) : (
            <PreviewNewsletter newsletters={newsletters} loading={false} /> 
          )}
        </div>
        <Partners/>
   </section>
  )
}

export default Newsletter