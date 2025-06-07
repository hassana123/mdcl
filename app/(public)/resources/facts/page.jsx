"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Banner from '@/components/Banner';
import Deco from '@/components/Deco';
import Partners from '@/components/Partners';
import Image from 'next/image';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Facts = () => {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const factsRef = collection(db, 'resources');
        const q = query(
          factsRef,
          where('category', '==', 'facts'),
          orderBy('title', 'asc')
        );
        const querySnapshot = await getDocs(q);
        const factsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFacts(factsList);
      } catch (err) {
        console.error('Error fetching facts:', err);
        setError('Failed to load facts.');
      } finally {
        setLoading(false);
      }
    };

    fetchFacts();
  }, []);

  return (
    <>
      <Banner
        title="Fact Sheets"
        subtitle={
          <span className="text-center font-medium text-white/70">
            <Link href="/" className="hover:underline">Home</Link> /{" "}
            <Link href="/resources" className="hover:underline">Resources</Link> /{" "}
            <span className="text-white font-bold">Fact Sheets</span>
          </span>
        }
      />
      <div className='lg:block hidden'>
        <Deco />
      </div>
      <section className='z-10 md:w-[85%] mx-auto w-[95%] my-10'>
        <div className="">
          {loading ? (
            <p>Loading facts...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : facts.length === 0 ? (
            <p>No facts available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facts.map((fact) => (
                <div key={fact.id} className="bg-white rounded-lg overflow-hidden shadow-md border-t-4 border-t-green-700 flex flex-col">
                  <div className="relative w-full h-40 bg-gray-200 rounded-t-lg overflow-hidden">
                    {fact.coverImage && (
                      <Image
                        src={fact.coverImage}
                        alt={fact.title || 'Fact Sheet Graphic'}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 flex-grow">{fact.title}</h3>
                    <div className="mt-auto pt-2">
                      <Link
                      target='_blank'
                        href={fact.pdfUrl}
                        className="text-md underline font-semibold text-green-700 hover:font-bold"
                      >
                        View Fact Sheet
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Partners />
    </>
  );
};

export default Facts;