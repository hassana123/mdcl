import React from 'react';
import Image from 'next/image';

const partnerImages = [
  '/mdcl/p1.png',
  '/mdcl/p6.png',
  '/mdcl/p5.png',
  '/mdcl/p4.jpg',
  '/mdcl/p3.png',
  '/mdcl/p2.png',
];

const Partners = () => {
  return (
    <section className="w-[85%] mx-auto grid grid-cols-4 sm:grid-cols-3 md:grid-cols-6 gap-6 place-items-center my-10">
      {partnerImages.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Partner ${index + 1}`}
          width={150}
          height={100}
          className="object-contain "
        />
      ))}
    </section>
  );
};

export default Partners;
