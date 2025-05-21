"use client";
import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';

const partnerImages = [
  '/mdcl/p1.png',
  '/mdcl/p6.png',
  '/mdcl/p5.png',
  '/mdcl/p4.jpg',
  '/mdcl/p3.png',
  '/mdcl/p2.png',
  '/mdcl/p7.png',
];

const Partners = () => {
  
  const images = [...partnerImages, ...partnerImages];
  return (
    <section className="w-full overflow-hidden py-8 bg-white">
      <Swiper
        modules={[Autoplay, FreeMode]}
        slidesPerView={6}
        spaceBetween={32}
        loop
        freeMode
        speed={4000}
        autoplay={{ delay: 0, disableOnInteraction: false }}
        allowTouchMove={false}
        className="w-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="flex items-center justify-center">
            <Image
              src={src}
              alt={`Partner ${index + 1}`}
              width={150}
              height={100}
              className="object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Partners;
