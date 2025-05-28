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
        spaceBetween={3}
        slidesPerView={3}
        loop
        freeMode
        speed={4000}
        autoplay={{ delay: 0, disableOnInteraction: false }}
        allowTouchMove={false}
        className="w-full"
        breakpoints={{
          // Mobile first
          320: {
            slidesPerView: 3,
            spaceBetween: 5,
          },
          // Small tablets
          480: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          // Tablets
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          // Large tablets
          768: {
            slidesPerView: 4,
            spaceBetween: 25,
          },
          // Laptops
          1024: {
            slidesPerView: 5,
            spaceBetween: 30,
          },
          // Large screens
          1280: {
            slidesPerView: 6,
            spaceBetween: 32,
          }
        }}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="flex items-center justify-center">
            <div className="relative w-[120px] h-[80px] md:w-[150px] md:h-[100px]">
              <Image
                src={src}
                alt={`Partner ${index + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 480px) 60px, (max-width: 640px) 80px, (max-width: 768px) 100px, (max-width: 1024px) 120px, 150px"
                priority={index < 4}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Partners;
