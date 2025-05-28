"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const Slideshow = () => {
  const eventImages = Array.from({ length: 20 }, (_, i) => `/mdcl/gallery/g (${i + 1}).jpg`);

  return (
    <section className="w-full py-8 bg-white mt-10">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="w-full"
        breakpoints={{
          // Mobile first
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          // Small tablets
          480: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          // Tablets
          640: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          // Large tablets
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          // Laptops
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          // Large screens
          1280: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
          // Extra large screens
          1536: {
            slidesPerView: 6,
            spaceBetween: 25,
          }
        }}
      >
        {eventImages.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-60 relative rounded-lg overflow-hidden shadow-md">
              <Image
                src={src}
                alt={`Event Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                priority={index === 0}
                quality={100}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Slideshow;