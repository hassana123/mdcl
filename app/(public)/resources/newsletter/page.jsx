"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import PreviewNewsletter from '@/components/PreviewNewsletter'
import Banner from '@/components/Banner'
import Deco from '@/components/Deco'
import Partners from '@/components/Partners'
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
                <Link href="/newsletter" className="hover:underline text-white font-bold">Newsletter</Link>
            </span>
            }
           
        />
        <Deco />
        <div className="">
         
          {loading ? (
            <p className='text-center'>Loading newsletters...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : newsletters.length === 0 ? (
            <p>No newsletters available at the moment.</p>
          ) : (
            <PreviewNewsletter newsletters={newsletters} /> 
          )}
        </div>
        <Partners/>
   </section>
  )
}

export default Newsletter